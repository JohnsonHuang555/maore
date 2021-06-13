import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Game, GameList } from 'models/Game';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { createdRoomIdSelector, roomsSelector } from 'selectors/roomSelector';
import { Button } from '@material-ui/core';
import CreateRoom from 'components/games/CreateRoom';
import { setShowLoginModal, setSnackbar } from 'actions/AppAction';
import { initialClient, createRoom, getAllRooms } from 'actions/ServerAction';
import RoomCard from 'components/games/RoomCard';
import styles from 'styles/pages/game.module.scss';
import { clientSelector } from 'selectors/serverSelector';
import { userInfoSelector } from 'selectors/appSelector';

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
  const createdRoomId = useSelector(createdRoomIdSelector);
  const rooms = useSelector(roomsSelector);
  const client = useSelector(clientSelector);
  const userInfo = useSelector(userInfoSelector);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // get current game
  const { data: game, error } = useSWR<Game, Error>(
    gamePack ? `/api/game/${gamePack}` : null,
    fetcher
  );

  useEffect(() => {
    if (client) {
      return;
    }
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (client && gamePack) {
      dispatch(getAllRooms(gamePack as GameList));
    }
  }, [client, gamePack]);

  useEffect(() => {
    if (createdRoomId) {
      // 建立完房間跳轉到房間頁
      router.push(`/rooms/${createdRoomId}`);
    }
  }, [createdRoomId]);

  if (error) return <div>{error.message}</div>;
  if (!game) return <div>Loading...</div>;

  const onCreateRoom = async (roomTitle: string) => {
    if (!userInfo) {
      setSnackbar({
        show: true,
        message: '請先登入',
      });
      return;
    }
    try {
      dispatch(
        createRoom({
          gamePack: gamePack as GameList,
          roomTitle,
          playerName: userInfo.name,
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

  const onJoinRoom = (roomId: string) => {
    if (!userInfo) {
      dispatch(setShowLoginModal(true));
      setSnackbar({
        show: true,
        message: '請先登入',
      });
      return;
    }
    router.push(`/rooms/${roomId}`);
  };

  return (
    <Layout>
      <CreateRoom
        show={showCreateRoomModal}
        selectedGame={game}
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
            size="large"
            className={styles.createRoom}
            variant="contained"
            color="secondary"
            onClick={() => {
              if (!userInfo) {
                dispatch(setShowLoginModal(true));
                dispatch(
                  setSnackbar({
                    show: true,
                    message: '請先登入',
                  })
                );
                return;
              }
              setShowCreateRoomModal(true);
            }}
          >
            建立房間
          </Button>
        </Grid>
        <Grid
          item
          lg={9}
          xs={8}
          container
          spacing={3}
          style={{ alignContent: 'flex-start' }}
        >
          {rooms.map((room) => (
            <RoomCard
              key={room.roomId}
              title={room.metadata?.roomTitle as string}
              maxPlayers={room.maxClients}
              nowPlayers={room.clients}
              joinRoom={() => onJoinRoom(room.roomId)}
            />
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Games;
