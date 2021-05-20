import { Game, GameList } from 'models/Game';

// TODO: 假資料之後寫入資料庫
export const games: Game[] = [
  {
    id: 1,
    name: '圈圈叉叉',
    minPlayers: 2,
    maxPlayers: 2,
    breif: '我的第一個遊戲',
    description:
      '中國大陸、臺灣又稱為井字遊戲、圈圈叉叉；另外也有打井遊戲、○×棋的稱呼，香港多稱井字過三關、過三關，是種紙筆遊戲，另有多種衍生變化玩法。',
    homeImg: '/tictactoe/home.png',
    estimateTime: 5,
    gamePack: GameList.TicTacToe,
  },
];
