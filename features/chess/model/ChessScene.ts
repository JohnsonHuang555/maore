import type Server from 'features/chess/ChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { Chess } from 'features/chess/model/Chess';

export type GameSceneData = {
  server: Server;
  chesses: Chess[];
  onGameOver: (data: GameOverSceneData) => void;
};
