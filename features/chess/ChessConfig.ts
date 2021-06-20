import { GameInstance } from '@ion-phaser/react';
import ChessBootstrap from './scenes/ChessBootStrap';
import Game from './scenes/Game';
// import GameOver from './scenes/GameOver';

export const ChessConfig: GameInstance = {
  width: 700,
  height: 700,
  type: Phaser.AUTO,
  scene: [ChessBootstrap, Game],
};
