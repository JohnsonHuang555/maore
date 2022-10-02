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
import { useCallback, useEffect, useReducer, useState } from 'react';
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
import { Button } from '@mui/material';
import { ChessSide } from './models/ChineseChessSide';
import { IChessInfo } from '@server/games/chinese_chess_hidden/state/ChessInfoState';
import GameOverModal from './components/GameOverModal';
import { setShowGameScreen } from '@actions/roomAction';
import BasicLayout from '@components/pages/rooms/game_layouts/BasicLayout';
import Rules from './components/Rules';
import { GamePack } from '@server/domain/Game';

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

    clientRoom.state.chineseChessHidden.chesses.onAdd = (chessInfo, key) => {
      localDispatch({ type: ActionType.SetChess, chess: chessInfo });
      chessInfo.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          console.log(field, value);
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
    }
  }, [isAllPlayerLoaded]);

  useEffect(() => {
    if (winnerIndex !== -1) {
      // 由 master 結束遊戲
      localDispatch({ type: ActionType.SetWinnerIndex, winnerIndex });

      if (isMaster) {
        clientRoom.send(RoomMessage.FinishGame);
      }
    }
  }, [winnerIndex]);

  useEffect(() => {
    if (state.chesses.length === 32 && isMaster) {
      clientRoom.send(RoomMessage.CreatePlayerOrder);
    }
  }, [state.chesses.length]);

  // useEffect(() => {
  //   console.log(isYourTurn, state.chesses.length);
  //   if (state.chesses.length === 32 && isYourTurn) {
  //     setShowYourTurnUI(true);
  //   }
  //   // if (gameSettings?.remainedSecond) {
  //   //   setTimer(gameSettings.remainedSecond);
  //   // }
  // }, [state.chesses.length, isYourTurn]);

  useEffect(() => {
    if (isYourTurn) {
      setShowYourTurnUI(true);
    }
  }, [isYourTurn]);

  useEffect(() => {
    // 已產好棋盤才開始
    if (showYourTurnUI) {
      setTimeout(() => {
        setShowYourTurnUI(false);
        // 多人才開啟計時
        // if (players.length > 1) {
        //   clientRoom.send(RoomMessage.SetTimer);
        // }
      }, 1000);
    }
  }, [showYourTurnUI]);

  const flipChess = (id: string) => {
    clientRoom.send(ChineseChessMessage.FlipChess, id);
  };

  const selectChess = (chess: IChessInfo) => {
    localDispatch({
      type: ActionType.SelectChess,
      chess,
    });
  };

  const moveChess = (targetX: number, targetY: number) => {
    clientRoom.send(ChineseChessMessage.MoveChess, {
      selectedChessId: state.selectedChess?.id as string,
      targetX,
      targetY,
    });
  };

  const eatChess = (targetId: string) => {
    clientRoom.send(ChineseChessMessage.EatChess, {
      selectedChessId: state.selectedChess?.id as string,
      targetId,
    });
  };

  const surrender = () => {
    clientRoom.send(ChineseChessMessage.Surrender);
  };

  const getChessSide = useCallback((side: ChessSide | '') => {
    switch (side) {
      case ChessSide.Black:
        return (
          <MaoreFlex
            verticalHorizonCenter
            sx={{
              backgroundColor: 'white',
              borderRadius: '50%',
              minWidth: '40px',
              height: '40px',
              color: 'black',
              fontSize: '22px',
              marginRight: '20px',
              fontFamily: 'cursive',
            }}
          >
            <MaoreFlex
              verticalHorizonCenter
              sx={{
                border: '1px solid black',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
              }}
            >
              將
            </MaoreFlex>
          </MaoreFlex>
        );
      case ChessSide.Red:
        return (
          <MaoreFlex
            verticalHorizonCenter
            sx={{
              backgroundColor: 'white',
              borderRadius: '50%',
              minWidth: '40px',
              height: '40px',
              color: 'red',
              fontSize: '22px',
              marginRight: '20px',
              fontFamily: 'cursive',
            }}
          >
            <MaoreFlex
              verticalHorizonCenter
              sx={{
                border: '1px solid red',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
              }}
            >
              帥
            </MaoreFlex>
          </MaoreFlex>
        );
      default:
        return null;
    }
  }, []);

  const getIsWinner = () => {
    const player = players.find((p) => p.id === yourPlayerId);
    if (player?.playerIndex === state.winnerIndex) {
      return true;
    }
    return false;
  };

  return (
    <BasicLayout
      showTimer={false}
      showYourTurnUI={showYourTurnUI}
      rules={<Rules />}
      gamePack={GamePack.ChineseChessHidden}
    >
      <GameOverModal
        show={state.winnerIndex !== -1}
        isWinner={getIsWinner()}
        onConfirm={() => dispatch(setShowGameScreen(false))}
      />
      <MaoreFlex sx={{ flex: 0.5, marginTop: '20px' }} verticalHorizonCenter>
        <MaoreFlex sx={{ width: '90vw' }} justifyContent="flex-end">
          <PlayerCard
            player={players.find((p) => p.id !== yourPlayerId) as Player}
            isNowTurn={!isYourTurn}
            children={getChessSide(state.otherSide)}
          />
        </MaoreFlex>
      </MaoreFlex>
      <MaoreFlex sx={{ flex: 2 }} verticalHorizonCenter>
        <Board
          chesses={state.chesses}
          selectedChess={state.selectedChess}
          isYourTurn={isYourTurn}
          yourSide={state.yourSide}
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
            children={getChessSide(state.yourSide)}
          />
        </MaoreFlex>
      </MaoreFlex>
      <Button
        sx={{
          width: {
            sm: '100px',
            md: '200px',
            lg: '250px',
          },
          backgroundColor: '#c04d30',
          ':hover': {
            backgroundColor: '#E76F51',
          },
          position: 'absolute',
          right: {
            xs: '10px',
            sm: '10px',
            md: '30px',
            lg: '50px',
          },
          bottom: {
            xs: '10px',
            sm: '10px',
            md: '30px',
            lg: '50px',
          },
        }}
        variant="contained"
        size="large"
        disableElevation
        onClick={surrender}
      >
        投降
      </Button>
    </BasicLayout>
  );
};

export default ChineseChessHidden;
