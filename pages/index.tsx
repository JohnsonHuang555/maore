import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import GameCard from '@components/pages/home/GameCard';
import Layout from 'components/Layout';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Game } from '@domain/models/Game';
import { initialClient } from '@actions/serverAction';
import { clientSelector } from '@selectors/serverSelector';
import { fetchGames } from '@actions/fetchAction';
import Image from 'next/image';
import { Box } from '@mui/material';

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
        <Box
          sx={{
            width: '100%',
            height: '400px',
            position: 'relative',
            marginBottom: '20px',
          }}
        >
          <Box
            sx={{
              backgroundImage: `url('/intro-picture.jpg')`,
              height: '100%',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
          {/* <Image
            src="/intro-picture.jpg"
            alt="Picture of the author"
            layout="fill"
            objectFit="cover"
          /> */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              background: 'rgba(0, 0, 0, 0.5)',
              top: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              fontSize: '40px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            🎲 這是一款真正的線上多人桌遊網站
          </Box>
        </Box>
        <Grid container spacing={2}>
          {games.map((game) => (
            <Grid key={game.id} item xl={2} lg={3} md={4} sm={6} xs={12}>
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
