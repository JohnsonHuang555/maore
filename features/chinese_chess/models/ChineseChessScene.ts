import type Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { ChineseChessGroup } from './ChineseChessGroup';
import { ChessInfo } from './ChineseChessState';

export type GameSceneData = {
  server: Server;
  chineseChesses: ChessInfo[];
};

export type PlayerGroup = {
  id: string;
  group: ChineseChessGroup | string;
};
