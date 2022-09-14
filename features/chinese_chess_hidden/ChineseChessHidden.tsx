import { useDispatch, useSelector } from 'react-redux';
import { RoomMessage } from '@domain/models/Message';
import {
  isAllPlayersLoadedSelector,
  isMasterSelector,
  isYourTurnSelector,
  playerIdSelector,
  winnerIndexSelector,
} from '@selectors/roomSelector';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer } from 'react';
import { clientRoomSelector } from '@selectors/serverSelector';
import chessReducer, {
  ActionType,
  initialState,
} from './reducers/chessReducer';
import { Box } from '@mui/material';
import Board from './components/Board';
import MaoreFlex from '@components/maore/MaoreFlex';
import { ChineseChessMessage } from './models/ChineseChessMessage';

const ChineseChessHidden = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const isYourTurn = useSelector(isYourTurnSelector);
  const winnerIndex = useSelector(winnerIndexSelector);
  const isMaster = useSelector(isMasterSelector);
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);

  const [state, localDispatch] = useReducer(chessReducer, initialState);

  if (!clientRoom) {
    throw new Error('client room not found...');
  }

  useEffect(() => {
    clientRoom.state.chineseChessHidden.chesses.onAdd = (chessInfo) => {
      localDispatch({ type: ActionType.SetChess, chess: chessInfo });
      chessInfo.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          localDispatch({
            type: ActionType.UpdateChess,
            id: chessInfo.id,
            chessInfo: { [field]: value },
          });
        });
      };
    };

    // 監聽玩家資訊更新
    clientRoom.state.chineseChessHidden.playerInfos.onAdd = (
      playerInfo,
      playerId
    ) => {
      playerInfo.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          console.log(field, value);
          switch (field) {
            case 'chessSide': {
              localDispatch({
                type: ActionType.UpdateChessSide,
                isYou: playerId === yourPlayerId ? true : false,
                chessSide: value,
              });
              break;
            }
          }
        });
      };
    };

    // 我載入完成
    clientRoom.send(RoomMessage.LoadedGame);
  }, []);

  useEffect(() => {
    // 當所有玩家載入完成，即打建立遊戲事件並判斷只打一次
    if (isAllPlayerLoaded && isMaster) {
      clientRoom.send(RoomMessage.CreateGame);
      clientRoom.send(RoomMessage.CreatePlayerOrder);
    }
  }, [isAllPlayerLoaded]);

  useEffect(() => {
    if (winnerIndex !== -1) {
      // 由 master 結束遊戲
      if (isMaster) {
        clientRoom.send(RoomMessage.FinishGame);
      }
    }
  }, [winnerIndex]);

  const flipChess = (id: string) => {
    clientRoom.send(ChineseChessMessage.FlipChess, id);
  };

  return (
    <MaoreFlex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        position: 'relative',
        background: '#264653',
      }}
    >
      <MaoreFlex sx={{ flex: 1 }}>123456</MaoreFlex>
      <MaoreFlex verticalHorizonCenter>
        <Board chesses={state.chesses} flipChess={flipChess} />
      </MaoreFlex>
      <MaoreFlex sx={{ flex: 1 }}>Me</MaoreFlex>
    </MaoreFlex>
  );
};

export default ChineseChessHidden;
