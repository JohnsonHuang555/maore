import { GameInstance } from '@ion-phaser/react';
import Bootstrap from './scenes/Bootstrap';
import Hidden from './scenes/mode/Hidden';

export const ChineseChessConfig: GameInstance = {
  width: innerWidth,
  height: innerHeight,
  type: Phaser.AUTO,
  scene: [Bootstrap, Hidden],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
  },
};
