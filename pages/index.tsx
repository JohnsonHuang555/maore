import useSWR from 'swr';
import GameCard from 'components/home/GameCard';
import Layout from 'components/Layout';
import { Game } from 'models/Game';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { initialClient } from 'actions/ServerAction';
import { clientSelector } from 'selectors/serverSelector';
import { fetcher } from 'pages/api/base/Fetcher';
import Container from '@mui/material/Container';

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
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          {games.map((game) => (
            <Grid
              key={game.id}
              item
              lg={2}
              md={4}
              xs={12}
              onClick={() => router.push(`/games/${game.gamePack}`)}
            >
              <GameCard game={game} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}
