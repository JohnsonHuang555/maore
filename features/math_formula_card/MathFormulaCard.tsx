import { RoomMessage } from '@domain/models/Message';
import { Box } from '@mui/material';
import {
  isAllPlayersLoadedSelector,
  playerIdSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import Card from './components/Card';
import playerCardsReducer, {
  ActionType,
  initialState,
} from './reducers/playerCardsReducer';

const MathFormulaCard = () => {
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const [state, dispatch] = useReducer(playerCardsReducer, initialState);

  useEffect(() => {
    if (!clientRoom) {
      throw new Error('client room not found...');
    }

    // clientRoom.onMessage('message', (message) => {
    //   console.log('message received from server');
    //   console.log(message);
    // });

    // 監聽抽牌
    clientRoom.state.playerInfos.onAdd = (playerInfo, playerId) => {
      if (playerId === yourPlayerId) {
        playerInfo.cards.onAdd = (playerCard) => {
          const { id, cardNumber, cardSymbol } = playerCard;
          dispatch({
            type: ActionType.DrawCard,
            playerCard: { id, cardNumber, cardSymbol },
          });
        };
      } else {
        playerInfo.cards.onAdd = (playerCard) => {
          dispatch({ type: ActionType.DrawOthersCard, playerId, playerCard });
        };
      }
    };
    // 監聽出牌
    // clientRoom.state.playerCards.onRemove = (changes) => {
    //   console.log(changes);
    // };

    clientRoom.send(RoomMessage.LoadedGame);

    return () => {
      clientRoom.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!clientRoom) {
      throw new Error('client room not found...');
    }

    // 當所有玩家載入完成，即打建立遊戲事件
    if (isAllPlayerLoaded) {
      clientRoom.send(RoomMessage.CreateGame);
    }
  }, [isAllPlayerLoaded]);

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
      <Box sx={{ flexBasis: '250px' }}></Box>
      {/* 答案區塊 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        6666
      </Box>
      {/* 自己手牌 */}
      <Box
        sx={{ flexBasis: '250px', display: 'flex', justifyContent: 'center' }}
      >
        {state.yourCards.map((card) => (
          <Card key={card.id} value={card.cardNumber} />
        ))}
      </Box>
    </Box>
  );
};

export default MathFormulaCard;
