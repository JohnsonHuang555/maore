import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { clientSelector, createdRoomIdSelector } from 'selectors/roomSelector';
import Grid from '@material-ui/core/Grid';
import styles from 'styles/pages/rooms.module.scss';
import { Message } from 'models/Message';
import { useRouter } from 'next/router';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'models/Room';
import { initialClient } from 'actions/RoomAction';
import { Button } from '@material-ui/core';
import PlayerList from 'components/rooms/PlayerCard';

const Rooms = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const roomId = router.query.id;
  const createdRoomId = useSelector(createdRoomIdSelector);
  const client = useSelector(clientSelector);

  const [currentRoom, setCurrentRoom] = useState<ClientRoom<Room>>();

  useEffect(() => {
    if (!client) {
      dispatch(initialClient());
    }
  }, [dispatch]);

  useEffect(() => {
    const joinRoom = async () => {
      const room = await client?.joinById<Room>(String(roomId));
      setCurrentRoom(room);
    };
    if (client && roomId && !createdRoomId) {
      joinRoom();
    }
  }, [client, roomId, createdRoomId]);

  useEffect(() => {
    if (currentRoom) {
      currentRoom.onMessage(
        Message.PlayerIndex,
        (message: { playerIndex: number; roomTitle: string }) => {
          console.log(message);
        }
      );
    }
  }, [currentRoom]);

  return (
    <Layout>
      <h2 className="title">測試</h2>
      <Grid container spacing={3} style={{ height: '100%' }}>
        <Grid item lg={9} className={styles.leftArea}>
          <div className={`${styles.playerList} ${styles.block}`}>
            <div className={styles.playerContent}>
              <PlayerList isNowPlayer={(pid) => true} />
            </div>
          </div>
          <div className={`${styles.messages} ${styles.block}`}>message</div>
        </Grid>
        <Grid item lg={3}>
          <div className={`${styles.block} ${styles.rightArea}`}>
            <div className={`${styles.content} ${styles.settings}`}>123</div>
            <Button variant="outlined" size="large" onClick={() => {}}>
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
