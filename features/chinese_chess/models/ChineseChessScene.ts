import type Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { ChessInfo } from './ChineseChessState';

export type GameSceneData = {
  server: Server;
  chineseChesses: ChessInfo[];
  onGameOver: (data: GameOverSceneData) => void;
};
