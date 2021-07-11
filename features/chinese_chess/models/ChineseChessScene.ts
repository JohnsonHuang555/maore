import type Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { ChineseChessGroup } from './ChineseChessGroup';
import { ChessInfo } from './ChineseChessState';

export type GameSceneData = {
  server: Server;
  chineseChesses: ChessInfo[];
  onGameOver: (data: GameOverSceneData) => void;
};

export type PlayerGroup = {
  id: string;
  playerName: string;
  group: ChineseChessGroup | string;
};
