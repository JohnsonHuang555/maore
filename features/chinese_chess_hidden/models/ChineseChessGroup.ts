import { ChessSide } from './ChineseChessSide';

export enum ChineseChessGroup {
  Black = 'black',
  Red = 'red',
}

export const ChineseChessGroupMap = {
  [ChessSide.Black]: ChineseChessGroup.Black,
  [ChessSide.Red]: ChineseChessGroup.Red,
};
