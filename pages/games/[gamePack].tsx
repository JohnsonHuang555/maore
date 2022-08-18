import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Game } from '@domain/models/Game';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import { createdRoomIdSelector, roomsSelector } from '@selectors/roomSelector';
import CreateRoom from '@components/pages/games/CreateRoomModal';
import { setLoading, setShowLoginModal } from '@actions/appAction';
import { initialClient, createRoom, getAllRooms } from '@actions/serverAction';
import RoomCard from '@components/pages/games/RoomCard';
import { clientSelector } from '@selectors/serverSelector';
import { loadingSelector, userInfoSelector } from '@selectors/appSelector';
import Info from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { fetchGame } from '@actions/fetchAction';
import { GameList } from 'server/domain/Game';
import { useSnackbar } from 'notistack';
import MaoreFlex from '@components/maore/MaoreFlex';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';

const Games = () => {
  const router = useRouter();
  const { gamePack } = router.query;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // selectors
  const createdRoomId = useSelector(createdRoomIdSelector);
  const rooms = useSelector(roomsSelector);
  const client = useSelector(clientSelector);
  const userInfo = useSelector(userInfoSelector);
  const loading = useSelector(loadingSelector);

  // useState
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // get current game
  const { data: game, error } = useSWR<Game, Error>(
    gamePack ? `/api/games/${gamePack}` : null,
    fetchGame
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

  const onCreateRoom = async (roomTitle: string, gameMode?: string) => {
    if (!userInfo) {
      enqueueSnackbar('請先登入', { variant: 'warning' });
      return;
    }
    try {
      dispatch(
        createRoom({
          gameMode,
          roomTitle,
          playerName: userInfo.name,
          gamePack: gamePack as GameList,
          photoURL: userInfo.photoURL,
        })
      );
    } catch (err: any) {
      const error = new Error(err);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const onJoinRoom = (roomId: string) => {
    if (!userInfo) {
      dispatch(setShowLoginModal(true));
      enqueueSnackbar('請先登入', { variant: 'warning' });
      return;
    }
    router.push(`/rooms/${roomId}`);
  };

  const handleCreateRoom = () => {
    if (!userInfo) {
      dispatch(setShowLoginModal(true));
      enqueueSnackbar('請先登入', { variant: 'warning' });
      return;
    }
    setShowCreateRoomModal(true);
  };

  const handleRefresh = () => {
    dispatch(setLoading(true));
    dispatch(getAllRooms(gamePack as GameList));
  };

  return (
    <Layout>
      <CreateRoom
        show={showCreateRoomModal}
        selectedGame={game}
        onClose={() => setShowCreateRoomModal(false)}
        onCreateRoom={onCreateRoom}
      />
      <Box sx={{ position: 'relative', marginBottom: '24px' }}>
        <Box
          sx={{
            backgroundImage: `url(${game.imageUrl})`,
            height: '350px',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        />
        <Container maxWidth={false} sx={{ position: 'absolute', top: '20px' }}>
          <Box component="label" color="white" sx={{ fontSize: '36px' }}>
            {game.name}
          </Box>
          <Box component="p" color="white" sx={{ fontSize: '22px' }}>
            {game.description}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '200px' }}
            >
              <Button
                size="large"
                variant="contained"
                sx={{ marginBottom: '20px' }}
                color="secondary"
                disableElevation
                onClick={handleCreateRoom}
              >
                建立房間
              </Button>
              <Button size="large" variant="contained" disableElevation>
                遊戲規則
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container maxWidth={false} sx={{ marginBottom: '40px' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <MaoreFlex alignItems="center" sx={{ marginBottom: '20px' }}>
              <Box sx={{ fontSize: '28px', flex: 1 }}>房間列表</Box>
              <Button
                size="large"
                variant="contained"
                color="info"
                disableElevation
                onClick={handleRefresh}
                startIcon={<RefreshIcon />}
              >
                刷新房間
              </Button>
            </MaoreFlex>
            <Grid container spacing={3}>
              {rooms.length ? (
                <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
                  {rooms.map(({ roomId, metadata, maxClients, clients }) => (
                    <RoomCard
                      key={roomId}
                      title={metadata?.roomTitle as string}
                      maxPlayers={maxClients}
                      nowPlayers={clients}
                      joinRoom={() => onJoinRoom(roomId)}
                    />
                  ))}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                    }}
                  >
                    <Info />
                    <Box sx={{ fontSize: '30px', marginLeft: '5px' }}>
                      查無房間
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Games;
