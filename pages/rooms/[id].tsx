import React, { useEffect, useMemo } from 'react';
import Layout from '@components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  createdRoomIdSelector,
  isLoginSelector,
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
import { clientRoomSelector, clientSelector } from '@selectors/serverSelector';
import dynamic from 'next/dynamic';
import { userInfoSelector } from '@selectors/appSelector';
import { setShowLoginModal } from '@actions/appAction';
import PlayerArea from '@components/pages/rooms/PlayerArea';
import ChatArea from '@components/pages/rooms/ChatArea';
import SettingArea from '@components/pages/rooms/SettingArea';
import { GameList } from 'server/domain/Game';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from 'firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RoomMessage } from '@domain/models/Message';
import { useSnackbar } from 'notistack';

const DynamicGameScreenWithNoSSR = dynamic(
  () => import('@components/pages/rooms/GameScreen'),
  { ssr: false }
);

const Rooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;
  const { enqueueSnackbar } = useSnackbar();

  // selectors
  const createdRoomId = useSelector(createdRoomIdSelector);
  const players = useSelector(playersSelector);
  const roomInfo = useSelector(roomInfoSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const client = useSelector(clientSelector);
  const userInfo = useSelector(userInfoSelector);
  const showGameScreen = useSelector(showGameScreenSelector);
  const messages = useSelector(messagesSelector);
  const isLogin = useSelector(isLoginSelector);
  const clientRoom = useSelector(clientRoomSelector);

  const auth = getAuth(firebaseApp);
  const [_user, loading, _error] = useAuthState(auth);

  // use effects start
  useEffect(() => {
    if (!loading && !createdRoomId) {
      if (userInfo && isLogin) {
        dispatch(joinRoom(String(roomId), userInfo.name));
      } else {
        dispatch(setShowLoginModal(true));
      }
    }
  }, [loading, isLogin]);

  useEffect(() => {
    if (client) {
      return;
    }
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (clientRoom) {
      clientRoom.onMessage(RoomMessage.PlayerLeft, ({ playerName }) => {
        enqueueSnackbar(`${playerName} ??????????????????`, { variant: 'info' });
      });
    }
  }, [clientRoom]);
  // use effect end

  useWarningOnExit({
    shouldWarn: true,
    leaveRoom,
  });

  const getIsReadyGameText = () => {
    const isReady = players.find((p) => p.isReady && p.id === yourPlayerId);
    if (isReady) {
      return '????????????';
    }
    return '????????????';
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
            <PlayerArea
              roomTitle={roomInfo.roomTitle}
              players={players}
              yourPlayerId={yourPlayerId}
            />
            <ChatArea messages={messages} />
          </Grid>
          <Grid item lg={3} xs={12}>
            <SettingArea
              gamePack={roomInfo.gamePack as GameList}
              // gameModes={game?.modes || []}
              disabledStartGame={checkDisabledStartGame()}
              isReadyGame={getIsReadyGameText()}
              onLeaveRoom={() =>
                (location.href = `/games/${roomInfo.gamePack}`)
              }
              onStartGame={() => dispatch(startGame())}
              onReadyGame={() => dispatch(readyGame())}
            />
          </Grid>
        </Grid>
      </Container>
      {showGameScreen && <DynamicGameScreenWithNoSSR />}
    </Layout>
  );
};

export default Rooms;
