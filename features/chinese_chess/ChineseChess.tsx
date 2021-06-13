import React, { useEffect, useRef, useState } from 'react';
import { IonPhaser, GameInstance } from '@ion-phaser/react';

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
  scene: [],
};

const ChineseChess = () => {
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
    setGame(Object.assign({}, gameConfig));
    return () => {
      destroy();
    };
  }, []);

  return <IonPhaser ref={gameRef} initialize={initialize} game={game} />;
};

export default ChineseChess;
