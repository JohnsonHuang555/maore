import Phaser from 'phaser';
import { GameInstance } from '@ion-phaser/react';
import Bootstrap from './scenes/Bootstrap';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

export const TicTacToeConfig: GameInstance = {
  width: 700,
  height: 600,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Bootstrap, Game, GameOver],
};
