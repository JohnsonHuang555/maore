import useSWR from 'swr';
import GameCard from 'components/home/GameCard';
import Layout from 'components/Layout';
import { Game } from 'models/Game';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { initialClient } from 'actions/ServerAction';
import { clientSelector } from 'selectors/serverSelector';
import styles from 'styles/pages/home.module.scss';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const client = useSelector(clientSelector);
  const { data: games, error } = useSWR<Game[], Error>('/api/game', fetcher);

  useEffect(() => {
    if (client) {
      return;
    }
    dispatch(initialClient());
  }, [dispatch]);

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!games) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h2 className="title">推薦遊戲</h2>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid
            key={game.id}
            item
            xs={3}
            onClick={() => router.push(`/games/${game.gamePack}`)}
          >
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
