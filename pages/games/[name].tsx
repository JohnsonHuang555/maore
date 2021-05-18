import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Game } from 'models/Game';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { initialClient, loadRoom } from 'actions/RoomAction';
import { clientSelector } from 'selectors/roomSelector';
import { Room as ClientRoom } from 'colyseus.js';
import Room from 'models/Room';
import { Button } from '@material-ui/core';
import CreateRoom from 'components/games/CreateRoom';
import styles from 'styles/pages/game.module.scss';
import { setSnackbar } from 'actions/AppAction';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Games = () => {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const client = useSelector(clientSelector);
  const [rooms, setRooms] = useState<ClientRoom<Room>[]>([]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // get current game
  const { data: game, error } = useSWR<Game, Error>(
    () => query.name && `/api/game/${query.name}`,
    fetcher
  );

  useEffect(() => {
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (client) {
      client
        .getAvailableRooms()
        .then((rooms: any) => {
          setRooms(rooms);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [client]);

  if (error) return <div>{error.message}</div>;
  if (!game) return <div>Loading...</div>;

  const onCreateRoom = async (name: string) => {
    if (!client) {
      return;
    }
    try {
      const room = await client.joinOrCreate<Room>(name);
      dispatch(loadRoom(room));
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
        <Grid item xs={4} className={styles.gameDetail}>
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
            disabled={!client}
            onClick={() => setShowCreateRoomModal(true)}
          >
            建立房間
          </Button>
        </Grid>
        <Grid item xs={8}>
          {rooms.map((room) => (
            <div>{room.name}</div>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Games;
