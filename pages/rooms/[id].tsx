import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { currentRoomIdSelector } from 'selectors/roomSelector';
import Grid from '@material-ui/core/Grid';
import styles from 'styles/pages/rooms.module.scss';
import { Message } from 'models/Message';
import { useRouter } from 'next/router';
import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'models/Room';
import { setPlayerIndex } from 'actions/RoomAction';
import { Button } from '@material-ui/core';
import PlayerList from 'components/rooms/PlayerCard';
import { initialClient, joinRoom } from 'actions/ServerAction';

const Rooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;
  const currentRoom = useSelector(currentRoomIdSelector);

  useEffect(() => {
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (roomId && !currentRoom) {
      dispatch(joinRoom(String(roomId)));
    }
    // const joinRoom = async () => {
    //   const room = await client?.joinById<Room>(String(roomId));
    //   setCurrentRoom(room);
    // };
    // if (roomId && !createdRoomId) {
    //   joinRoom();
    // }
  }, [roomId, currentRoom]);

  // useEffect(() => {
  //   if (currentRoom) {
  //     currentRoom.onMessage(
  //       Message.JoinRoom,
  //       (message: { playerIndex: number }) => {
  //         dispatch(setPlayerIndex(message.playerIndex));
  //       }
  //     );

  //     currentRoom.state.players.onAdd = (player, key) => {
  //       console.log(player, key);
  //     };

  //     // currentRoom.state.onChange = (changes) => {
  //     //   changes.forEach((change) => {
  //     //     const { field, value } = change;
  //     //     console.log(change);
  //     //     switch (
  //     //       field
  //     //       // case 'board':
  //     //       //   this.events.emit('board-changed', value);
  //     //       //   break;
  //     //     ) {
  //     //     }
  //     //   });
  //     // };
  //   }
  // }, [currentRoom]);

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
