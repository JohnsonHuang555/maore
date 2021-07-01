import { ChessSide } from './Chess';

export enum ChineseChessGroup {
  Black,
  Red,
}

export const ChineseChessGroupMap = {
  [ChessSide.Black]: ChineseChessGroup.Black,
  [ChessSide.Red]: ChineseChessGroup.Red,
};
