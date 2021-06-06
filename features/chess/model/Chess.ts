export type Chess = {
  id: number;
  x: number;
  y: number;
  side: Side;
  name: ChessName;
}

export enum Side {
  Black,
  White,
};

export enum ChessName {
  Minion = 'Minion',
  Caslte = 'Caslte',
  Kight = 'Kight',
  Bishop = 'Bishop',
  Queen = 'Queen',
  King = 'King',
}
