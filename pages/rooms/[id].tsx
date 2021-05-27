import React, { useEffect } from 'react';
import Layout from 'components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  createdRoomIdSelector,
  playerIndexSelector,
  playersSelector,
  roomInfoSelector,
} from 'selectors/roomSelector';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import { Button, TextField } from '@material-ui/core';
import PlayerList from 'components/rooms/PlayerCard';
import { initialClient, joinRoom, leaveRoom } from 'actions/ServerAction';
import styles from 'styles/pages/rooms.module.scss';

const Rooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;
  const createdRoomId = useSelector(createdRoomIdSelector);
  const players = useSelector(playersSelector);
  const roomInfo = useSelector(roomInfoSelector);
  const playerIndex = useSelector(playerIndexSelector);

  // component did mount
  useEffect(() => {
    const leaveRoomHandler = () => {
      dispatch(leaveRoom());
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

  return (
    <Layout>
      <h2 className="title">{roomInfo.title}</h2>
      <Grid container spacing={3} style={{ height: '100%' }}>
        <Grid item lg={9} xs={9} className={styles.leftArea}>
          <div className={`${styles.playerList} ${styles.block}`}>
            <div className={styles.playerContent}>
              <PlayerList players={players} />
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
              label="寫點什麼吧..."
              variant="outlined"
              size="small"
            />
          </div>
        </Grid>
        <Grid item lg={3} xs={3}>
          <div className={`${styles.block} ${styles.rightArea}`}>
            <div className={`${styles.content} ${styles.settings}`}>123</div>
            <Button
              style={{ marginBottom: '10px' }}
              variant="contained"
              color="secondary"
              size="large"
              className={styles.readyGame}
              onClick={() => {}}
            >
              準備遊戲
            </Button>
            <Button variant="outlined" size="large" onClick={() => {}}>
              離開房間
            </Button>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Rooms;
