import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import Bootstrap from './scenes/Bootstrap';

const gameConfig: GameInstance = {
  width: 700,
  height: 600,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Bootstrap],
};

const TicTacToe = () => {
  const gameRef = useRef<HTMLIonPhaserElement>();
  const [game, setGame] = useState<GameInstance>();
  const [initialize, setInitialize] = useState(false);

  const destroy = () => {
    gameRef.current?.destroy();
    setInitialize(false);
    setGame(undefined);
  };

  useEffect(() => {
    setInitialize(true);
    setGame(Object.assign({}, gameConfig));
    return () => {
      destroy();
    };
  }, []);

  return <IonPhaser initialize={initialize} game={game} />;
};

export default TicTacToe;
