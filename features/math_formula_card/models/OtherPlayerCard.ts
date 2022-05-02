// id => 幾張牌
export type OtherPlayerDict = {
  [key: string]: OthersPlayerInfo;
};

export type OthersPlayerInfo = {
  remainCardCount: number;
  name: string;
  point: number;
  isNowTurn: boolean;
};
