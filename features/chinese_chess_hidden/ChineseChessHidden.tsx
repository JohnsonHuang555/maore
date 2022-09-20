import { useDispatch, useSelector } from 'react-redux';
import { RoomMessage } from '@domain/models/Message';
import {
  isAllPlayersLoadedSelector,
  isMasterSelector,
  isYourTurnSelector,
  playerIdSelector,
  playersSelector,
  winnerIndexSelector,
} from '@selectors/roomSelector';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer, useState } from 'react';
import { clientRoomSelector } from '@selectors/serverSelector';
import chessReducer, {
  ActionType,
  initialState,
} from './reducers/chessReducer';
import Board from './components/Board';
import MaoreFlex from '@components/maore/MaoreFlex';
import { ChineseChessMessage } from './models/ChineseChessMessage';
import PlayerCard from '@components/pages/rooms/PlayerCard';
import { Player } from '@domain/models/Player';
import { IChessInfo } from '@server/games/chinese_chess_hidden/state/ChessInfoState';
import { Backdrop, Box } from '@mui/material';

const ChineseChessHidden = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const isYourTurn = useSelector(isYourTurnSelector);
  const winnerIndex = useSelector(winnerIndexSelector);
  const isMaster = useSelector(isMasterSelector);
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const players = useSelector(playersSelector);

  const [showYourTurnUI, setShowYourTurnUI] = useState(false);

  const [state, localDispatch] = useReducer(chessReducer, initialState);

  if (!clientRoom) {
    throw new Error('client room not found...');
  }

  useEffect(() => {
    // listening message from server
    clientRoom.onMessage(ChineseChessMessage.ErrorMsg, (message) => {
      enqueueSnackbar(message, { variant: 'warning' });
    });

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
          switch (field) {
            case 'chessSide': {
              localDispatch({
                type: ActionType.UpdateChessSide,
                isYou: playerId === yourPlayerId ? true : false,
                chessSide: value,
              });
              break;
            }
            case 'locationX': {
              console.log(field, value);
              break;
            }
            case 'locationY': {
              console.log(field, value);
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

  useEffect(() => {
    if (isYourTurn) {
      console.log('???');
      setShowYourTurnUI(true);
    }
    // if (gameSettings?.remainedSecond) {
    //   setTimer(gameSettings.remainedSecond);
    // }
  }, [isYourTurn]);

  useEffect(() => {
    if (showYourTurnUI) {
      setTimeout(() => {
        setShowYourTurnUI(false);
        // 多人才開啟計時
        // if (players.length > 1) {
        //   clientRoom.send(RoomMessage.SetTimer);
        // }
      }, 2000);
    }
  }, [showYourTurnUI]);

  const flipChess = (id: string) => {
    clientRoom.send(ChineseChessMessage.FlipChess, id);
  };

  const selectChess = (id: string) => {
    localDispatch({
      type: ActionType.SelectChess,
      id,
    });
  };

  const moveChess = (targetX: number, targetY: number) => {
    clientRoom.send(ChineseChessMessage.MoveChess, {
      selectedChessId: state.selectedChessId,
      targetX,
      targetY,
    });
  };

  const eatChess = (targetId: string) => {
    clientRoom.send(ChineseChessMessage.EatChess, {
      selectedChessId: state.selectedChessId,
      targetId,
    });
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showYourTurnUI}
      >
        <Box sx={{ fontSize: '40px' }}>輪到你了</Box>
      </Backdrop>
      <MaoreFlex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          position: 'relative',
          background: '#264653',
        }}
      >
        <MaoreFlex sx={{ flex: 0.5 }} verticalHorizonCenter>
          <MaoreFlex sx={{ width: '90vw' }} justifyContent="flex-end">
            <PlayerCard
              player={players.find((p) => p.id !== yourPlayerId) as Player}
              isNowTurn={!isYourTurn}
            />
          </MaoreFlex>
        </MaoreFlex>
        <MaoreFlex sx={{ flex: 2 }} verticalHorizonCenter>
          <Board
            chesses={state.chesses}
            hasSelectedChess={!!state.selectedChessId}
            isYourTurn={isYourTurn}
            flipChess={flipChess}
            selectChess={selectChess}
            moveChess={moveChess}
            eatChess={eatChess}
          />
        </MaoreFlex>
        <MaoreFlex sx={{ flex: 0.5 }} verticalHorizonCenter>
          <MaoreFlex sx={{ width: '90vw' }}>
            <PlayerCard
              player={players.find((p) => p.id === yourPlayerId) as Player}
              isYou={true}
              isNowTurn={isYourTurn}
            />
          </MaoreFlex>
        </MaoreFlex>
      </MaoreFlex>
    </>
  );
};

export default ChineseChessHidden;
