import { GameList } from 'models/Game';
import { TicTacToeConfig } from 'features/tictactoe/TicTacToeConfig';
import { ChineseChessConfig } from 'features/chinese_chess/ChineseChessConfig';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import React, { useEffect, useRef, useState } from 'react';

type GameScreenProps = {
  gamePack: GameList | '';
};

/** 決定要使用的遊戲 */
const GameScreen = (props: GameScreenProps) => {
  const { gamePack } = props;
  const gameRef = useRef<HTMLIonPhaserElement>(null);
  const [game, setGame] = useState<GameInstance>();
  const [initialize, setInitialize] = useState(false);

  const playingGame: { [key: string]: GameInstance } = {
    [GameList.TicTacToe]: TicTacToeConfig,
    [GameList.ChineseChess]: ChineseChessConfig,
  };

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
    <IonPhaser
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1200',
      }}
      ref={gameRef}
      initialize={initialize}
      game={game}
    />
  );
};

export default GameScreen;
