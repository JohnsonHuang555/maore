import { GameInstance } from '@ion-phaser/react';

export const ChineseChessConfig: GameInstance = {
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
