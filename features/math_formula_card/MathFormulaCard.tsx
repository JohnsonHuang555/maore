import { RoomMessage } from '@domain/models/Message';
import { Box } from '@mui/material';
import {
  isAllPlayersLoadedSelector,
  playerIdSelector,
  playersSelector,
  activePlayerSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { CardSymbol } from 'server/games/math_formula_card/state/PlayerCardState';
import Card from './components/Card';
import OtherPlayer from './components/OtherPlayer';
import playerCardsReducer, {
  ActionType,
  initialState,
} from './reducers/playerCardsReducer';

type MathFormulaCardProps = {
  isMaster: boolean;
};

const MathFormulaCard = (props: MathFormulaCardProps) => {
  const { isMaster } = props;
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const players = useSelector(playersSelector);
  const activePlayer = useSelector(activePlayerSelector);
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
        const player = players.find((p) => p.id === playerId);
        if (!player) {
          throw new Error('player not found');
        }
        // 初始化玩家資訊
        dispatch({
          type: ActionType.InitOthersPlayerInfo,
          playerId,
          name: player.name,
        });

        playerInfo.cards.onAdd = () => {
          dispatch({ type: ActionType.DrawOthersCard, playerId });
        };
      }
    };

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
    if (isAllPlayerLoaded && isMaster) {
      clientRoom.send(RoomMessage.CreateGame);
    }
  }, [isAllPlayerLoaded]);

  const renderOtherPlayer = (other: string) => {
    const obj = state.otherPlayerDict[other];
    return (
      <Box sx={{ flex: 'calc(1/3)' }} key={other}>
        <OtherPlayer
          remainCardCount={obj.remainCardCount}
          name={obj.name}
          point={obj.point}
          isNowTurn={obj.isNowTurn}
        />
      </Box>
    );
  };

  const handleSelectCard = (val: number | CardSymbol) => {
    console.log(val);
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
      <Box sx={{ flexBasis: '250px', display: 'flex', alignItems: 'center' }}>
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
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ fontSize: '26px' }}>目標</Box>
          <Box sx={{ fontSize: '120px' }}>66</Box>
        </Box>
      </Box>
      {/* 自己手牌 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          fontSize: '40px',
        }}
      >
        1+2+3
      </Box>
      <Box
        sx={{ flexBasis: '250px', display: 'flex', justifyContent: 'center' }}
      >
        {state.yourCards.map((card) => (
          <Card
            key={card.id}
            value={card.cardNumber || card.cardSymbol}
            onSelect={handleSelectCard}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MathFormulaCard;
