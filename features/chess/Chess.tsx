import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { IonPhaser, GameInstance } from '@ion-phaser/react';

const gameConfig: GameInstance = {
  width: 700,
  height: 700,
  type: Phaser.AUTO,
  scene: [],
};

const Chess = () => {
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

export default Chess;
