import { useEffect, useRef, useState } from 'react';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { GameList } from '@domain/models/Game';
import { TicTacToeConfig } from 'features/tictactoe/TicTacToeConfig';
import { ChineseChessConfig } from 'features/chinese_chess/ChineseChessConfig';
import { GameScreenProps } from '../GameScreen';
import { Box } from '@mui/material';

const playingGame: { [key: string]: GameInstance } = {
  [GameList.TicTacToe]: TicTacToeConfig,
  [GameList.ChineseChess]: ChineseChessConfig,
};

const Phaser = (props: GameScreenProps) => {
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
          backgroundColor: '#1d1d1d',
        }}
        ref={gameRef}
        initialize={initialize}
        game={game}
      />
    </Box>
  );
};

export default Phaser;
