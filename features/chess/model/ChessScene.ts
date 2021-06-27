import type Server from 'features/chess/ChessServer';
import { GameOverSceneData } from 'models/Scenes';

export type GameSceneData = {
  server: Server;
  onGameOver: (data: GameOverSceneData) => void;
};
