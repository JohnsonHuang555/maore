export type Chess = {
  id: number;
  x: ChessColumnName;
  y: ChessRowName;
  side: Side;
  name: ChessName;
  alive: boolean;
}

export enum Side {
  Black = 'black',
  White = 'white',
};

export enum ChessName {
  Pawn = 'pawn',
  Castle = 'castle',
  Knight = 'knight',
  Bishop = 'bishop',
  Queen = 'queen',
  King = 'king',
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
