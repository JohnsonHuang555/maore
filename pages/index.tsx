import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import GameCard from 'components/home/GameCard';
import Layout from 'components/Layout';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Game } from 'domain/models/Game';
import { initialClient } from '@actions/ServerAction';
import { clientSelector } from '@selectors/serverSelector';
import { fetchGames } from '@actions/FetchAction';

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const client = useSelector(clientSelector);
  const { data: games, error } = useSWR<Game[], Error>(
    '/api/games',
    fetchGames
  );

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
      <Container maxWidth={false} style={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          {games.map((game) => (
            <Grid key={game.id} item lg={2} md={4} sm={6} xs={12}>
              <GameCard
                game={game}
                onSelectGame={() => router.push(`/games/${game.gamePack}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Home;
