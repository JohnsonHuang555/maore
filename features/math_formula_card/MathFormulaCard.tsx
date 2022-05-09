import { setSnackbar } from '@actions/appAction';
import { RoomMessage } from '@domain/models/Message';
import { Box, Button, Zoom } from '@mui/material';
import {
  isAllPlayersLoadedSelector,
  playerIdSelector,
  playersSelector,
  isYourTurnSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CardSymbol,
  IPlayerCard,
} from 'server/games/math_formula_card/state/PlayerCardState';
import Card from './components/Card';
import OtherPlayer from './components/OtherPlayer';
import { MathFormulaCardMessage } from './models/MathFormulaCardMessage';
import playerCardsReducer, {
  ActionType,
  initialState,
} from './reducers/playerCardsReducer';
import Badge from '@mui/material/Badge';

type MathFormulaCardProps = {
  isMaster: boolean;
};

const MathFormulaCard = (props: MathFormulaCardProps) => {
  const { isMaster } = props;
  const dispatch = useDispatch();
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const players = useSelector(playersSelector);
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const isYourTurn = useSelector(isYourTurnSelector);
  const [state, localDispatch] = useReducer(playerCardsReducer, initialState);
  // 為了做抽牌的動畫，只有第一載入完成時要延遲，用 state 控制
  const [noDrawCardDelay, setNoDrawCardDelay] = useState(false);

  if (!clientRoom) {
    throw new Error('client room not found...');
  }

  useEffect(() => {
    // listening message from server
    clientRoom.onMessage(
      MathFormulaCardMessage.UseCardsFailed,
      ({ message }) => {
        dispatch(
          setSnackbar({
            show: true,
            message,
          })
        );
      }
    );

    clientRoom.onMessage(MathFormulaCardMessage.AnswerCorrectly, () => {
      localDispatch({ type: ActionType.ClearSelectedCards });
      dispatch(
        setSnackbar({
          show: true,
          message: '你答對了',
        })
      );
    });

    clientRoom.onMessage(MathFormulaCardMessage.AnsweredWrong, () => {
      dispatch(
        setSnackbar({
          show: true,
          message: '你答錯了',
        })
      );
    });

    clientRoom.state.listen('answer', (currentValue) => {
      localDispatch({
        type: ActionType.CreateAnswer,
        answer: currentValue as number,
      });
    });

    // 監聽玩家資訊更新
    clientRoom.state.playerInfos.onAdd = (playerInfo, playerId) => {
      if (playerId === yourPlayerId) {
        playerInfo.onChange = (changes) => {
          changes.forEach((change) => {
            const { field, value } = change;
            switch (field) {
              case 'point': {
                localDispatch({
                  type: ActionType.UpdateYourPoint,
                  point: value,
                });
                break;
              }
            }
          });
        };
        playerInfo.cards.onAdd = (playerCard) => {
          const { id, cardNumber, cardSymbol } = playerCard;
          localDispatch({
            type: ActionType.DrawCard,
            playerCard: { id, cardNumber, cardSymbol },
          });
        };

        playerInfo.cards.onRemove = (card) => {
          localDispatch({
            type: ActionType.UseCard,
            cardId: card.id,
          });
        };
      } else {
        const player = players.find((p) => p.id === playerId);
        if (!player) {
          throw new Error('player not found');
        }
        // 初始化玩家資訊
        localDispatch({
          type: ActionType.InitOthersPlayerInfo,
          playerId,
          name: player.name,
        });

        playerInfo.onChange = (changes) => {
          changes.forEach((change) => {
            const { field, value } = change;
            switch (field) {
              case 'point': {
                localDispatch({
                  type: ActionType.UpdateOthersPlayerInfo,
                  playerId,
                  playerInfo: {
                    point: value,
                  },
                });
                break;
              }
            }
          });
        };

        playerInfo.cards.onAdd = () => {
          localDispatch({ type: ActionType.DrawOthersCard, playerId });
        };

        playerInfo.cards.onRemove = (card) => {
          localDispatch({
            type: ActionType.UseOthersCard,
            playerId,
          });
        };
      }
    };

    clientRoom.send(RoomMessage.LoadedGame);

    return () => {
      clientRoom.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // 當所有玩家載入完成，即打建立遊戲事件並判斷只打一次
    if (isAllPlayerLoaded && isMaster && state.answer === undefined) {
      clientRoom.send(RoomMessage.CreateGame);
      clientRoom.send(RoomMessage.CreatePlayerOrder);
    }
  }, [isAllPlayerLoaded]);

  useEffect(() => {
    if (state.errorMsg) {
      dispatch(
        setSnackbar({
          show: true,
          message: state.errorMsg,
        })
      );
      localDispatch({ type: ActionType.ClearErrorMsg });
    }
  }, [state.errorMsg]);

  const renderOtherPlayer = (other: string) => {
    const { remainCardCount, name, point, isNowTurn } =
      state.otherPlayerDict[other];
    return (
      <Box sx={{ flex: 1 }} key={other}>
        <OtherPlayer
          playerCount={players.length}
          remainCardCount={remainCardCount}
          name={name}
          point={point}
          isNowTurn={isNowTurn}
        />
      </Box>
    );
  };

  const renderYourCard = (card: IPlayerCard, index: number) => {
    const isSelected = state.selectedCards.findIndex((s) => s.id === card.id);
    return (
      <Zoom
        key={card.id}
        in={true}
        style={{
          transitionDelay: noDrawCardDelay ? '0ms' : `${index * 100}ms`,
        }}
      >
        <Badge
          invisible={isSelected === -1}
          badgeContent={isSelected + 1}
          color="secondary"
          sx={{
            span: {
              width: '30px',
              height: '30px',
              borderRadius: '50%',
            },
            '.MuiPaper-elevation': {
              border: isSelected !== -1 ? '1px solid' : 'none',
            },
          }}
        >
          <Card
            key={card.id}
            id={card.id}
            value={card.cardSymbol || card.cardNumber}
            width="120px"
            height="100%"
            onSelect={handleSelectCard}
          />
        </Badge>
      </Zoom>
    );
  };

  const handleSelectCard = (id: string, value: number | CardSymbol) => {
    // 還沒輪到你
    if (!isYourTurn) {
      dispatch(
        setSnackbar({
          show: true,
          message: '還沒輪到你',
        })
      );
      return;
    }
    localDispatch({ type: ActionType.SelectCard, id, value });
  };

  const useCards = () => {
    // 代表已經載入完成，改無延遲時間
    setNoDrawCardDelay(true);
    if (!state.selectedCards.length) {
      return;
    }
    const netCards: IPlayerCard[] = state.selectedCards.map((card) => {
      if (!isNaN(card.value as number)) {
        return {
          id: card.id,
          cardNumber: card.value as number,
        };
      }
      return {
        id: card.id,
        cardSymbol: card.value as CardSymbol,
      };
    });
    clientRoom.send(MathFormulaCardMessage.UseCards, { cards: netCards });
  };

  const drawCard = () => {
    // 代表已經載入完成，改無延遲時間
    setNoDrawCardDelay(true);
    clientRoom.send(MathFormulaCardMessage.DrawCard);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 其他玩家區塊 */}
      <Box
        sx={{
          flexBasis: '15%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {Object.keys(state.otherPlayerDict).map((other) =>
          renderOtherPlayer(other)
        )}
      </Box>
      {/* 答案區塊 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {state.selectedCards.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: '80px',
                background: 'rgba(0,0,0,0.2)',
                padding: '10px 20px',
                marginTop: '50px',
                marginRight: '20px',
                gap: '10px',
              }}
            >
              {state.selectedCards.map((selectedCard, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  {Card.getLabel(selectedCard.value)}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ fontSize: '26px' }}>題目</Box>
            <Box sx={{ fontSize: '120px' }}>={state.answer}</Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', marginBottom: '20px', fontSize: '36px' }}>
        {isYourTurn ? '你的回合' : ''}
      </Box>
      {/* 自己手牌 */}
      <Box
        sx={{
          flexBasis: '15%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            height: '100%',
          }}
        >
          {state.yourCards.map((card, index) => renderYourCard(card, index))}
        </Box>
      </Box>
      {/* 操作 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '15px',
        }}
      >
        <Box sx={{ marginRight: '20px', fontSize: '26px' }}>
          你的分數: {state.yourPoint}
        </Box>
        <Button
          sx={{
            minWidth: '100px',
            backgroundColor: '#555454',
            ':hover': { backgroundColor: '#454444' },
          }}
          variant="contained"
          size="large"
          onClick={() => localDispatch({ type: ActionType.SortCard })}
        >
          排序
        </Button>
        <Button
          sx={{
            minWidth: '100px',
            backgroundColor: '#555454',
            ':hover': { backgroundColor: '#454444' },
          }}
          variant="contained"
          size="large"
          onClick={() => {
            if (state.selectedCards.length) {
              localDispatch({ type: ActionType.ClearSelectedCards });
            }
          }}
        >
          重選
        </Button>
        <Button
          sx={{
            minWidth: '150px',
            backgroundColor: '#095858',
            ':hover': {
              backgroundColor: '#044040',
            },
          }}
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => drawCard()}
        >
          抽牌並結束回合
        </Button>
        <Button
          sx={{ minWidth: '150px' }}
          variant="contained"
          size="large"
          color="secondary"
          disabled={!isYourTurn}
          onClick={() => useCards()}
        >
          出牌
        </Button>
      </Box>
    </Box>
  );
};

export default MathFormulaCard;
