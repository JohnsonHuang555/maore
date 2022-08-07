import { useEffect, useRef, useState } from 'react';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { ChineseChessConfig } from 'features/chinese_chess/ChineseChessConfig';
import { Box } from '@mui/material';
import { GameList } from 'server/domain/Game';

const playingGame: { [key: string]: GameInstance } = {
  [GameList.ChineseChess]: ChineseChessConfig,
};

type PhaserProps = {
  gamePack: GameList;
};

const Phaser = (props: PhaserProps) => {
  const { gamePack } = props;
  const gameRef = useRef<HTMLIonPhaserElement>(null);
  const [game, setGame] = useState<GameInstance>();
  const [initialize, setInitialize] = useState(false);

  const destroy = () => {
    gameRef.current?.destroy();
    setInitialize(false);
    setGame(undefined);
  };

  useEffect(() => {
    setInitialize(true);
    setGame(Object.assign({}, playingGame[gamePack]));
    return () => {
      destroy();
    };
  }, []);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <IonPhaser
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: '1200',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#2a434f',
        }}
        ref={gameRef}
        initialize={initialize}
        game={game}
      />
    </Box>
  );
};

export default Phaser;
