import React, { useEffect } from 'react';
import Layout from 'components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  createdRoomIdSelector,
  playersSelector,
  roomInfoSelector,
} from 'selectors/roomSelector';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import { Button, TextField } from '@material-ui/core';
import PlayerList from 'components/rooms/PlayerCard';
import {
  initialClient,
  joinRoom,
  leaveRoom,
  readyGame,
} from 'actions/ServerAction';
import { reset } from 'actions/RoomAction';
import { playerIdSelector } from 'selectors/roomSelector';
import styles from 'styles/pages/rooms.module.scss';
import { Player } from 'models/Player';

const Rooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;
  const createdRoomId = useSelector(createdRoomIdSelector);
  const players = useSelector(playersSelector);
  const roomInfo = useSelector(roomInfoSelector);
  const yourPlayerId = useSelector(playerIdSelector);

  // component did mount
  useEffect(() => {
    const leaveRoomHandler = () => {
      dispatch(leaveRoom());
      // 房主要reset
      if (createdRoomId) {
        dispatch(reset());
      }
    };
    const beforeLeaveRoom = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('unload', leaveRoomHandler);
    window.addEventListener('beforeunload', beforeLeaveRoom);
    return () => {
      window.removeEventListener('unload', leaveRoomHandler);
      window.removeEventListener('beforeunload', beforeLeaveRoom);
    };
  }, []);

  useEffect(() => {
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (roomId && !createdRoomId) {
      dispatch(joinRoom(String(roomId), 'Alice'));
    }
  }, [roomId, createdRoomId]);

  const isMaster = (): boolean => {
    const player = players.find((p) => p.isMaster && p.id === yourPlayerId);
    if (player) {
      return true;
    }
    return false;
  };

  const isReadyGame = () => {
    const isReady = players.find((p) => p.isReady && p.id === yourPlayerId);
    if (isReady) {
      return '取消準備';
    }
    return '準備遊戲';
  };

  const disabledStartGame = () => {
    const isAnyPlayerNotReady = players.filter((p) => !p.isReady);
    if (roomInfo.maxPlayers > players.length || isAnyPlayerNotReady.length) {
      return true;
    }
    return false;
  };

  return (
    <Layout>
      <h2 className="title">{roomInfo.roomTilte}</h2>
      <Grid container spacing={3} style={{ height: '100%' }}>
        <Grid item lg={9} xs={9} className={styles.leftArea}>
          <div className={`${styles.playerList} ${styles.block}`}>
            <div className={styles.playerContent}>
              <PlayerList players={players} yourPlayerId={yourPlayerId} />
            </div>
          </div>
          <div className={`${styles.messages} ${styles.block}`}>
            <div className={styles.messageContent}>
              <span className={styles.message}>笑死</span>
              <span className={styles.message}>快開始阿</span>
              <span className={styles.message}>單挑</span>
              <span className={styles.message}>sp4</span>
            </div>
            <TextField
              id="outlined-basic"
              label="說點什麼吧..."
              variant="outlined"
              size="small"
            />
          </div>
        </Grid>
        <Grid item lg={3} xs={3}>
          <div className={`${styles.block} ${styles.rightArea}`}>
            <div className={`${styles.content} ${styles.settings}`}>123</div>
            {isMaster() ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                disabled={disabledStartGame()}
                className={styles.startGame}
                onClick={() => {}}
              >
                開始遊戲
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                className={styles.readyGame}
                onClick={() => dispatch(readyGame())}
              >
                {isReadyGame()}
              </Button>
            )}
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Rooms;
