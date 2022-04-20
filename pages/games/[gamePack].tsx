import { useEffect, useState } from "react";
import Layout from "components/Layout";
import { Game, GameList } from "domain/models/Game";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { createdRoomIdSelector, roomsSelector } from "@selectors/roomSelector";
import CreateRoom from "components/games/CreateRoomModal";
import { setShowLoginModal, setSnackbar } from "@actions/appAction";
import { initialClient, createRoom, getAllRooms } from "@actions/serverAction";
import RoomCard from "components/games/RoomCard";
import { clientSelector } from "@selectors/serverSelector";
import { userInfoSelector } from "@selectors/appSelector";
import Info from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { fetchGame } from "@actions/fetchAction";

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
      dispatch(
        setSnackbar({
          show: true,
          message: '請先登入',
        })
      );
      return;
    }
    try {
      dispatch(
        createRoom({
          gameMode,
          roomTitle,
          playerName: userInfo.name,
          gamePack: gamePack as GameList,
        })
      );
    } catch (err: any) {
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

  const handleCreateRoom = () => {
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
                onClick={handleCreateRoom}
              >
                建立房間
              </Button>
              <Button size="large" variant="contained">
                遊戲規則
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {rooms.length ? (
            <Grid item lg={3} md={4} xs={2}>
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
                <Box sx={{ fontSize: '30px', marginLeft: '5px' }}>查無房間</Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Games;
