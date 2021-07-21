import React, { useEffect, useRef, useState } from 'react';
import Layout from 'components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import {
  createdRoomIdSelector,
  messagesSelector,
  playersSelector,
  roomInfoSelector,
  showGameScreenSelector,
} from 'selectors/roomSelector';
import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import PlayerList from 'components/rooms/PlayerCard';
import {
  initialClient,
  joinRoom,
  leaveRoom,
  readyGame,
  sendMessage,
  startGame,
} from 'actions/ServerAction';
import { playerIdSelector } from 'selectors/roomSelector';
import styles from 'styles/pages/rooms.module.scss';
import { useWarningOnExit } from 'customhooks/useWarningOnExit';
import { clientSelector } from 'selectors/serverSelector';
import dynamic from 'next/dynamic';
import { isLoginSelector, userInfoSelector } from 'selectors/appSelector';
import { setShowLoginModal } from 'actions/AppAction';
import { Send } from '@material-ui/icons';

const DynamicGameScreenWithNoSSR = dynamic(
  () => import('components/rooms/GameScreen'),
  { ssr: false }
);

const Rooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;
  const createdRoomId = useSelector(createdRoomIdSelector);
  const players = useSelector(playersSelector);
  const roomInfo = useSelector(roomInfoSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const client = useSelector(clientSelector);
  const userInfo = useSelector(userInfoSelector);
  const isLogin = useSelector(isLoginSelector);
  const showGameScreen = useSelector(showGameScreenSelector);
  const messages = useSelector(messagesSelector);

  const [currentMessage, setCurrentMessage] = useState('');
  const messageRef = useRef<any>(null);

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
    if (messageRef && messageRef.current) {
      messageRef.current.addEventListener('DOMNodeInserted', () => {
        const scroll =
          messageRef.current.scrollHeight - messageRef.current.clientHeight;
        messageRef.current.scrollTo(0, scroll);
      });
    }
  }, []);

  useEffect(() => {
    if (client) {
      return;
    }
    dispatch(initialClient());
  }, [dispatch]);

  useEffect(() => {
    if (roomId && !createdRoomId && isLogin && userInfo) {
      dispatch(joinRoom(String(roomId), userInfo.name));
    }
  }, [roomId, createdRoomId, isLogin]);
  // use effect end

  const isMaster = (): boolean => {
    const player = players.find((p) => p.isMaster && p.id === yourPlayerId);
    if (player) {
      return true;
    }
    return false;
  };

  const isReadyGame = () => {
    const isReady = players.find((p) => p.isReady && p.id === yourPlayerId);
    if (isReady) {
      return '取消準備';
    }
    return '準備遊戲';
  };

  const disabledStartGame = () => {
    const isAnyPlayerNotReady = players.filter((p) => !p.isReady);
    if (roomInfo.maxPlayers > players.length || isAnyPlayerNotReady.length) {
      return true;
    }
    return false;
  };

  const onSendMessage = () => {
    if (!currentMessage) {
      return;
    }
    dispatch(sendMessage(currentMessage));
    setCurrentMessage('');
  };

  return (
    <Layout>
      <h2 className="title">{roomInfo.roomTilte}</h2>
      <Grid container spacing={3} style={{ height: '100%' }}>
        <Grid item lg={9} xs={9} className={styles.leftArea}>
          <div className={`${styles.playerList} ${styles.block}`}>
            <div className={styles.playerContent}>
              <PlayerList players={players} yourPlayerId={yourPlayerId} />
            </div>
          </div>
          <div className={`${styles.messages} ${styles.block}`}>
            <div className={styles.contentWrapper}>
              <div className={styles.overflowContainer} ref={messageRef}>
                <div className={styles.overflowContent}>
                  {messages.map((message, index) => (
                    <span key={index} className={styles.message}>
                      {message}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <TextField
              id="outlined-basic"
              label="說點什麼吧..."
              variant="outlined"
              size="small"
              value={currentMessage}
              InputProps={{
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    onSendMessage();
                  }
                },
                onChange: (e) => {
                  setCurrentMessage(e.target.value);
                },
                endAdornment: (
                  <InputAdornment position="start">
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSendMessage()}
                    >
                      <Send />
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Grid>
        <Grid item lg={3} xs={3}>
          <div className={`${styles.block} ${styles.rightArea}`}>
            <div className={`${styles.content} ${styles.settings}`}>123</div>
            {isMaster() ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                disabled={disabledStartGame()}
                className={styles.startGame}
                onClick={() => dispatch(startGame())}
              >
                開始遊戲
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                className={styles.readyGame}
                onClick={() => dispatch(readyGame())}
              >
                {isReadyGame()}
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              className={styles.leaveRoom}
              onClick={() => router.push('/')}
            >
              離開房間
            </Button>
          </div>
        </Grid>
      </Grid>
      {showGameScreen && (
        <DynamicGameScreenWithNoSSR gamePack={roomInfo.gamePack} />
      )}
    </Layout>
  );
};

export default Rooms;
