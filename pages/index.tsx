import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import GameCard from '@components/pages/home/GameCard';
import Layout from 'components/Layout';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Game } from '@domain/models/Game';
import { initialClient } from '@actions/serverAction';
import { clientSelector } from '@selectors/serverSelector';
import { fetchGames } from '@actions/fetchAction';
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
      <Container maxWidth={false} style={{ margin: '20px 0' }}>
        <Box
          sx={{
            width: '100%',
            height: {
              xs: '200px',
              sm: '300px',
              lg: '400px',
            },
            position: 'relative',
            marginBottom: '20px',
          }}
        >
          {/* <Box
            sx={{
              backgroundImage: `url('/intro-picture.jpg')`,
              height: '100%',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          /> */}
          <Image
            src="/intro-picture.jpg"
            alt="intro-image"
            layout="fill"
            objectFit="cover"
          />
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
              fontSize: {
                xs: '18px',
                sm: '24px',
                lg: '30px',
              },
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Box>🎲 這是一款真正的線上多人桌遊網站</Box>
            <Box
              sx={{
                fontSize: {
                  xs: '16px',
                  sm: '22px',
                  lg: '26px',
                },
              }}
            >
              超ㄅㄧㄤˋ遊戲等你來玩
            </Box>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ marginBottom: '60px' }}>
          {games.map((game) => (
            <Grid key={game.id} item xl={2} lg={3} md={4} sm={4} xs={12}>
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
