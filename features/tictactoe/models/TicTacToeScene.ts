import type Server from 'features/tictactoe/TicTacToeServer';
import { GameOverSceneData } from '@models/Scenes';

export type GameSceneData = {
  server: Server;
  onGameOver: (data: GameOverSceneData) => void;
};
