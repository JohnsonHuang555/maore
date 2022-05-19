import React, { useEffect } from 'react';
import Layout from '@components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  createdRoomIdSelector,
  messagesSelector,
  playersSelector,
  roomInfoSelector,
  showGameScreenSelector,
} from '@selectors/roomSelector';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';
import {
  initialClient,
  joinRoom,
  leaveRoom,
  readyGame,
  startGame,
} from '@actions/serverAction';
import { playerIdSelector } from '@selectors/roomSelector';
import { useWarningOnExit } from 'customhooks/useWarningOnExit';
import { clientSelector } from '@selectors/serverSelector';
import dynamic from 'next/dynamic';
import { userInfoSelector } from '@selectors/appSelector';
import { setShowLoginModal } from '@actions/appAction';
import PlayerArea from '@components/rooms/PlayerArea';
import ChatArea from '@components/rooms/ChatArea';
import SettingArea from '@components/rooms/SettingArea';
import { fetchGame } from '@actions/fetchAction';

const DynamicGameScreenWithNoSSR = dynamic(
  () => import('@components/rooms/GameScreen'),
  { ssr: false }
);

const Rooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;

  // selectors
  const createdRoomId = useSelector(createdRoomIdSelector);
  const players = useSelector(playersSelector);
  const roomInfo = useSelector(roomInfoSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const client = useSelector(clientSelector);
  const userInfo = useSelector(userInfoSelector);
  const showGameScreen = useSelector(showGameScreenSelector);
  const messages = useSelector(messagesSelector);

  useWarningOnExit({
    shouldWarn: true,
    leaveRoom,
  });

  // use effects start
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      dispatch(setShowLoginModal(true));
    }
  }, []);

  useEffect(() => {
    if (client) {
      return;
    }
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (roomId && !createdRoomId && userInfo) {
      dispatch(joinRoom(String(roomId), userInfo.name));
    }
  }, [roomId, createdRoomId]);
  // use effect end

  // console.log(roomInfo);
  // const { data: game, error } = useSWR<Game, Error>(
  //   roomInfo ? `/api/game/${roomInfo.gamePack}` : null,
  //   fetchGame
  // );

  // if (error) {
  //   throw new Error('Game not loaded');
  // }

  const checkIsMaster = (): boolean => {
    const player = players.find((p) => p.isMaster && p.id === yourPlayerId);
    if (player) {
      return true;
    }
    return false;
  };

  const getIsReadyGameText = () => {
    const isReady = players.find((p) => p.isReady && p.id === yourPlayerId);
    if (isReady) {
      return '取消準備';
    }
    return '準備遊戲';
  };

  const checkDisabledStartGame = () => {
    const isAnyPlayerNotReady = players.filter((p) => !p.isReady);
    if (isAnyPlayerNotReady.length) {
      return true;
    }
    return false;
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ height: '100%' }}>
        <Grid container spacing={2} sx={{ marginTop: '0', height: '100%' }}>
          <Grid
            item
            lg={9}
            xs={12}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <PlayerArea players={players} yourPlayerId={yourPlayerId} />
            <ChatArea messages={messages} />
          </Grid>
          <Grid item lg={3} xs={12}>
            <SettingArea
              gamePack={roomInfo.gamePack}
              // gameModes={game?.modes || []}
              isMaster={checkIsMaster()}
              disabledStartGame={checkDisabledStartGame()}
              isReadyGame={getIsReadyGameText()}
              onLeaveRoom={() => router.push('/')}
              onStartGame={() => dispatch(startGame())}
              onReadyGame={() => dispatch(readyGame())}
            />
          </Grid>
        </Grid>
      </Container>
      {showGameScreen && (
        <DynamicGameScreenWithNoSSR isMaster={checkIsMaster()} />
      )}
    </Layout>
  );
};

export default Rooms;
