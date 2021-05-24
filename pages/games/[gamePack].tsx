import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Game, GameList } from 'models/Game';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { currentRoomIdSelector, roomsSelector } from 'selectors/roomSelector';
import { Button } from '@material-ui/core';
import CreateRoom from 'components/games/CreateRoom';
import { setSnackbar } from 'actions/AppAction';
import styles from 'styles/pages/game.module.scss';
import { initialClient, createRoom } from 'actions/ServerAction';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Games = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { gamePack } = router.query;
  const currentRoom = useSelector(currentRoomIdSelector);
  const rooms = useSelector(roomsSelector);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // get current game
  const { data: game, error } = useSWR<Game, Error>(
    gamePack ? `/api/game/${gamePack}` : null,
    fetcher
  );

  useEffect(() => {
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (currentRoom) {
      // 建立完房間跳轉到房間頁
      router.push(`/rooms/${currentRoom.id}`);
    }
  }, [currentRoom]);

  if (error) return <div>{error.message}</div>;
  if (!game) return <div>Loading...</div>;

  const onCreateRoom = async (roomTitle: string) => {
    try {
      // const room = await client.create<Room>(game.gamePack, metaData);
      dispatch(
        createRoom({
          gamePack: gamePack as GameList,
          roomTitle,
        })
      );
    } catch (err) {
      const error = new Error(err);
      dispatch(
        setSnackbar({
          show: true,
          message: error.message,
        })
      );
    }
  };

  return (
    <Layout>
      <CreateRoom
        show={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        onCreateRoom={onCreateRoom}
      />
      <h2 className="title">{game.name}</h2>
      <Grid container spacing={3} style={{ height: '100%' }}>
        <Grid item lg={3} xs={4} className={styles.gameDetail}>
          <Image
            src={game.homeImg}
            alt={game.name}
            height={350}
            width={500}
            layout="responsive"
          />
          <p className={styles.description}>{game.description}</p>
          <Button
            variant="outlined"
            size="large"
            className={styles.createRoom}
            onClick={() => setShowCreateRoomModal(true)}
          >
            建立房間
          </Button>
        </Grid>
        <Grid item lg={9} xs={8}>
          {rooms.map((room) => (
            <div>{room.metadata?.roomTitle}</div>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Games;
