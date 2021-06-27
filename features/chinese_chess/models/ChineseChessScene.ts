import type Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';

export type GameSceneData = {
  server: Server;
  onGameOver: (data: GameOverSceneData) => void;
};
