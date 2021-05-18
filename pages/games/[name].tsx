import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Game } from 'models/Game';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import useSWR from 'swr';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { initialClient } from 'actions/RoomAction';
import { clientSelector } from 'selectors/roomSelector';
import { Room as ClientRoom } from 'colyseus.js';
import Room from 'models/Room';

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
  const disptach = useDispatch();
  const client = useSelector(clientSelector);
  const [rooms, setRooms] = useState<ClientRoom<Room>[]>([]);

  // get current game
  const { data: game, error } = useSWR<Game, Error>(
    () => query.name && `/api/game/${query.name}`,
    fetcher
  );

  useEffect(() => {
    disptach(initialClient());
  }, [disptach]);

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

  return (
    <Layout>
      <h2 className="title">{game.name}</h2>
      <Grid container spacing={3} style={{ height: '100%' }}>
        <Grid item xs={4}>
          <Image
            src={game.homeImg}
            alt={game.name}
            height={350}
            width={500}
            layout="responsive"
          />
          <p>{game.description}</p>
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
