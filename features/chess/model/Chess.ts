export type Chess = {
  id: number;
  x: ChessColumnName;
  y: ChessRowName;
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

export enum ChessColumnName {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
};

export enum ChessRowName {
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
};
