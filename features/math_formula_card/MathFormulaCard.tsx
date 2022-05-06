import { setSnackbar } from '@actions/appAction';
import { RoomMessage } from '@domain/models/Message';
import { Box, Button } from '@mui/material';
import {
  isAllPlayersLoadedSelector,
  playerIdSelector,
  playersSelector,
  activePlayerSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer } from 'react';
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

type MathFormulaCardProps = {
  isMaster: boolean;
};

const MathFormulaCard = (props: MathFormulaCardProps) => {
  const { isMaster } = props;
  const dispatch = useDispatch();
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const players = useSelector(playersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const [state, localDispatch] = useReducer(playerCardsReducer, initialState);

  if (!clientRoom) {
    throw new Error('client room not found...');
  }

  useEffect(() => {
    // listening message from server
    clientRoom.onMessage('UseCardsFailed', ({ message }) => {
      dispatch(
        setSnackbar({
          show: true,
          message,
        })
      );
    });

    clientRoom.onMessage(MathFormulaCardMessage.AnswerCorrectly, () => {
      dispatch(
        setSnackbar({
          show: true,
          message: '答對了',
        })
      );
    });

    // 監聽抽牌
    clientRoom.state.playerInfos.onAdd = (playerInfo, playerId) => {
      if (playerId === yourPlayerId) {
        playerInfo.cards.onAdd = (playerCard) => {
          const { id, cardNumber, cardSymbol } = playerCard;
          localDispatch({
            type: ActionType.DrawCard,
            playerCard: { id, cardNumber, cardSymbol },
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

        playerInfo.cards.onAdd = () => {
          localDispatch({ type: ActionType.DrawOthersCard, playerId });
        };
      }
    };

    clientRoom.send(RoomMessage.LoadedGame);

    return () => {
      clientRoom.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // 當所有玩家載入完成，即打建立遊戲事件
    if (isAllPlayerLoaded && isMaster) {
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
          remainCardCount={remainCardCount}
          name={name}
          point={point}
          isNowTurn={isNowTurn}
        />
      </Box>
    );
  };

  const handleSelectCard = (id: string, value: number | CardSymbol) => {
    const player = players.find((p) => p.id === yourPlayerId);
    if (!player) {
      throw new Error('player not found');
    }
    // 還沒輪到你
    if (player.playerIndex !== activePlayer) {
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
      <Box sx={{ flexBasis: '220px', display: 'flex', alignItems: 'center' }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ fontSize: '26px' }}>目標</Box>
          <Box sx={{ fontSize: '120px' }}>66</Box>
        </Box>
        {state.selectedCards.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px',
              fontSize: '40px',
              background: 'rgba(0,0,0,0.2)',
              padding: '10px 20px',
              position: 'absolute',
              bottom: 0,
              minWidth: '200px',
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
      {/* 自己手牌 */}
      <Box
        sx={{ flexBasis: '250px', display: 'flex', justifyContent: 'center' }}
      >
        {state.yourCards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            value={card.cardSymbol || card.cardNumber}
            onSelect={handleSelectCard}
          />
        ))}
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
        <Button
          sx={{
            minWidth: '100px',
            backgroundColor: '#555454',
            ':hover': { backgroundColor: '#454444' },
          }}
          variant="contained"
          size="large"
          onClick={() => {}}
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
          onClick={() => {}}
        >
          重選
        </Button>
        <Button
          sx={{ minWidth: '150px' }}
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => useCards()}
        >
          出牌
        </Button>
      </Box>
    </Box>
  );
};

export default MathFormulaCard;
