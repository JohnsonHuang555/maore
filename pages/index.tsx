import useSWR from 'swr';
import GameCard from 'components/home/GameCard';
import Layout from 'components/Layout';
import { Game } from 'domain/models/Game';
import Grid from '@material-ui/core/Grid';
import styles from 'styles/pages/home.module.scss';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: games, error } = useSWR<Game[]>('/api/game', fetcher);
  if (error) {
    return <div>Failed to load</div>;
  }

  if (!games) {
    return <div>Loading...</div>;
  }
  return (
    <Layout>
      <h2 className={styles.title}>推薦遊戲</h2>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid key={game.id} item xs={3}>
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
