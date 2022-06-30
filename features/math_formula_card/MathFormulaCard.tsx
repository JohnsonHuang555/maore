import { RoomMessage } from '@domain/models/Message';
import {
  Box,
  Button,
  CardActionArea,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Zoom,
  Card as MuiCard,
} from '@mui/material';
import {
  isAllPlayersLoadedSelector,
  playerIdSelector,
  playersSelector,
  isYourTurnSelector,
  winnerIndexSelector,
  isMasterSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import Card from './components/Card';
import OtherPlayer from './components/OtherPlayer';
import { MathFormulaCardMessage } from './models/MathFormulaCardMessage';
import playerCardsReducer, {
  ActionType,
  initialState,
} from './reducers/playerCardsReducer';
import {
  selectedCardSymbolDict,
  selectedCardLabelDict,
  getSelectedCardLabel,
} from './components/SelectedCardDict';
import GameOverModal from './components/GameOverModal';
import { setShowGameScreen } from '@actions/roomAction';
import { gameSettingsSelector } from '@selectors/game_settings/mathFormulaSelector';
import { useSnackbar } from 'notistack';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';
import PlayerAvatar from './components/PlayerAvatar';

const MathFormulaCard = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const gameSettings = useSelector(gameSettingsSelector);
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const players = useSelector(playersSelector);
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const isYourTurn = useSelector(isYourTurnSelector);
  const winnerIndex = useSelector(winnerIndexSelector);
  const isMaster = useSelector(isMasterSelector);
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
        enqueueSnackbar(message, { variant: 'warning' });
      }
    );

    clientRoom.onMessage(MathFormulaCardMessage.AnswerCorrectly, () => {
      enqueueSnackbar('你答對了', { variant: 'success' });
    });

    clientRoom.onMessage(MathFormulaCardMessage.AnsweredWrong, () => {
      enqueueSnackbar('你答錯了!!', { variant: 'error' });
    });

    clientRoom.state.mathFormulaCard.listen('answer', (currentValue) => {
      localDispatch({
        type: ActionType.CreateAnswer,
        answer: currentValue as number,
      });
    });

    // 監聽玩家資訊更新
    clientRoom.state.mathFormulaCard.playerInfos.onAdd = (
      playerInfo,
      playerId
    ) => {
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
          const { id, cardNumber } = playerCard;
          localDispatch({
            type: ActionType.DrawCard,
            playerCard: { id, cardNumber },
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

        playerInfo.cards.onRemove = () => {
          localDispatch({
            type: ActionType.UseOthersCard,
            playerId,
          });
        };
      }
    };

    clientRoom.state.mathFormulaCard.selectedElements.onAdd = (
      selectedElement
    ) => {
      const { id, cardNumber, mathSymbol } = selectedElement;
      const value = mathSymbol || cardNumber;
      if (value !== undefined) {
        localDispatch({ type: ActionType.SelectCard, id, value });
      }
    };

    clientRoom.state.mathFormulaCard.selectedElements.onRemove = (
      selectedElement
    ) => {
      const { id, cardNumber, mathSymbol } = selectedElement;
      const value = mathSymbol || cardNumber;
      if (value !== undefined) {
        localDispatch({ type: ActionType.SelectCard, id, value });
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
      enqueueSnackbar(state.errorMsg, { variant: 'error' });
      localDispatch({ type: ActionType.ClearErrorMsg });
    }
  }, [state.errorMsg]);

  useEffect(() => {
    if (winnerIndex !== -1) {
      localDispatch({ type: ActionType.SetWinnerIndex, winnerIndex });
      // 由 master 結束遊戲
      if (isMaster) {
        clientRoom.send(RoomMessage.FinishGame);
      }
    }
  }, [winnerIndex]);

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
        <Box>
          <Card
            key={card.id}
            id={card.id}
            value={card.cardNumber}
            width="100px"
            onSelect={handleSelectCard}
          />
        </Box>
      </Zoom>
    );
  };

  // 選擇手牌
  const handleSelectCard = (id: string) => {
    // 還沒輪到你
    if (!isYourTurn) {
      enqueueSnackbar('還沒輪到你', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.SelectCardNumber, { id });
  };

  // 選擇符號
  const handleSelectSymbol = (mathSymbol: MathSymbol) => {
    // 還沒輪到你
    if (!isYourTurn) {
      enqueueSnackbar('還沒輪到你', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.SelectMathSymbol, { mathSymbol });
  };

  const useCards = () => {
    // 代表已經載入完成，改無延遲時間
    setNoDrawCardDelay(true);
    if (!state.selectedCards.length) {
      enqueueSnackbar('請選牌', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.UseCards);
  };

  const drawCard = () => {
    // 代表已經載入完成，改無延遲時間
    setNoDrawCardDelay(true);
    clientRoom.send(MathFormulaCardMessage.DrawCard);
  };

  const getIsWinner = () => {
    const player = players.find((p) => p.id === yourPlayerId);
    if (player?.playerIndex === state.winnerIndex) {
      return true;
    }
    return false;
  };

  return (
    <>
      <GameOverModal
        show={state.winnerIndex !== -1}
        isWinner={getIsWinner()}
        onConfirm={() => dispatch(setShowGameScreen(false))}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#264653',
        }}
      >
        {/* 操作區塊 */}
        <Box sx={{ position: 'absolute', top: '25px', right: '50px' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="規則說明">
              <IconButton size="large" aria-label="leave_room">
                <DescriptionOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="離開遊戲">
              <IconButton
                size="large"
                aria-label="leave_room"
                onClick={() => (location.href = '/games/math-formula-card')}
              >
                <LogoutIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
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
          <Box></Box>
          {/* <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {getSelectedCardLabel(selectedCard.value)}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ fontSize: '26px' }}>題目</Box>
              <Box sx={{ fontSize: '120px' }}>={state.answer}</Box>
            </Box>
            <Box sx={{ marginTop: '150px', marginRight: '50px' }}>
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: '10px',
                  fontSize: '26px',
                }}
              >
                數學符號
              </Box>
              <Grid container spacing={1} sx={{ width: '176px' }}>
              </Grid>
            </Box>
          </Box>*/}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: '20px',
          }}
        >
          <Box sx={{ marginBottom: '10px', fontSize: '24px' }}>數學算式牌</Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            {Object.keys(selectedCardSymbolDict).map((symbol) => (
              <Zoom
                key={symbol}
                in={true}
                style={{
                  transitionDelay: '500ms',
                }}
              >
                <Box>
                  <Card
                    id={symbol}
                    value={selectedCardSymbolDict[symbol]}
                    width="60px"
                    bgColor="#CCB8B2"
                    fontColor="#264653"
                    symbolSize="10px"
                    iconColor="#FFFFFF"
                    iconSize="inherit"
                    onSelect={handleSelectCard}
                  />
                </Box>
                {/* <MuiCard
                  sx={{
                    height: '80px',
                    border: '5px solid #525252',
                    backgroundColor: '#1d1d1d',
                  }}
                  onClick={() => handleSelectSymbol(symbol as MathSymbol)}
                >
                  <CardActionArea
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '36px',
                    }}
                  >
                    {selectedCardSymbolDict[symbol]}
                  </CardActionArea>
                </MuiCard> */}
              </Zoom>
            ))}
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', fontSize: '30px' }}>
          {isYourTurn ? '你的回合' : '其他玩家回合'}
        </Box>
        {/* 自己手牌 */}
        <Box
          sx={{
            flexBasis: '14%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Box
            sx={{
              width: '15vw',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                fontSize: '26px',
              }}
            >
              勝利條件: {gameSettings?.winnerPoint} 分
            </Box>
            <PlayerAvatar />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              flexWrap: 'wrap',
              width: '70vw',
            }}
          >
            {state.yourCards.map((card, index) => renderYourCard(card, index))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '15vw',
              padding: '40px',
            }}
          >
            <Button
              sx={{
                maxWidth: '200px',
                backgroundColor: '#E76F51',
                ':hover': {
                  backgroundColor: '#c04d30',
                },
                marginBottom: '20px',
              }}
              variant="contained"
              size="large"
              disableElevation
              color="secondary"
              disabled={!isYourTurn || state.winnerIndex !== -1}
              onClick={() => drawCard()}
            >
              抽牌
            </Button>
            <Button
              sx={{
                maxWidth: '200px',
                backgroundColor: '#415761',
                ':hover': {
                  backgroundColor: '#385968',
                },
              }}
              variant="contained"
              size="large"
              disableElevation
              disabled={!isYourTurn || state.winnerIndex !== -1}
              onClick={() => {
                if (state.selectedCards.length !== 0) {
                  clientRoom.send(MathFormulaCardMessage.ClearSelectedCards);
                }
              }}
            >
              重選
            </Button>
          </Box>
        </Box>
        {/* 操作 */}
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '15px',
          }}
        >
          <Box sx={{ marginRight: '20px', fontSize: '26px' }}>
            勝利條件: {gameSettings?.winnerPoint} 分
          </Box>
          <Box sx={{ marginRight: '20px', fontSize: '26px' }}>
            分數:{' '}
            <Box component="span" sx={{ color: 'secondary.light' }}>
              {state.yourPoint}
            </Box>{' '}
            分
          </Box>
          <Button
            sx={{
              minWidth: '100px',
              backgroundColor: '#555454',
              ':hover': { backgroundColor: '#454444' },
            }}
            variant="contained"
            size="large"
            disableElevation
            disabled={state.winnerIndex !== -1}
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
            disableElevation
            disabled={!isYourTurn || state.winnerIndex !== -1}
            onClick={() => {
              if (state.selectedCards.length !== 0) {
                clientRoom.send(MathFormulaCardMessage.ClearSelectedCards);
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
            disableElevation
            color="secondary"
            disabled={!isYourTurn || state.winnerIndex !== -1}
            onClick={() => drawCard()}
          >
            抽牌並結束回合
          </Button>
          <Button
            sx={{ minWidth: '150px' }}
            variant="contained"
            size="large"
            disableElevation
            color="secondary"
            disabled={!isYourTurn || state.winnerIndex !== -1}
            onClick={() => useCards()}
          >
            出牌
          </Button>
        </Box> */}
      </Box>
    </>
  );
};

export default MathFormulaCard;
