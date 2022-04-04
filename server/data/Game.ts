import { Game } from '../domain/Game';
import { GameMode as ChineseChessMode } from '../../features/chinese_chess/models/ChinesChessMode';

// TODO: 假資料之後寫入資料庫
export const games: Game[] = [
  // {
  //   id: 1,
  //   name: '圈圈叉叉',
  //   minPlayers: 2,
  //   maxPlayers: 2,
  //   brief: '我的第一個遊戲',
  //   description:
  //     '中國大陸、臺灣又稱為井字遊戲、圈圈叉叉；另外也有打井遊戲、○×棋的稱呼，香港多稱井字過三關、過三關，是種紙筆遊戲，另有多種衍生變化玩法。',
  //   imgPath: '/tictactoe/home.png',
  //   estimateTime: 5,
  //   gamePack: GameList.TicTacToe,
  // },
  {
    id: 2,
    name: '象棋',
    brief: '經典遊戲',
    description:
      '象棋是中國大陸、香港、台灣、馬來西亞、新加坡、越南、琉球地區所流行的傳統的2人對弈棋類遊戲。中國大陸為了進行區分稱此為中國象棋，將西方的「Chess」稱為國際象棋；台灣將「Chess」翻譯為「西洋棋」。 中國象棋與西洋棋及圍棋並列世界三大棋類之一，類似的有韓國將棋、日本將棋等。',
    image_url: '/chinese_chess/home.png',
    estimate_time: 5,
    create_at: 'September 14, 2021',
    modes: [
      {
        name: ChineseChessMode.Standard,
        image_url: '/chinese_chess/standard.png',
        min_players: 2,
        max_players: 2,
      },
      {
        name: ChineseChessMode.Hidden,
        image_url: '/chinese_chess/hidden.png',
        min_players: 2,
        max_players: 2,
      },
    ],
  },
  {
    id: 3,
    name: '忠誠數字牌',
    brief: '原創遊戲',
    description:
      '考驗你的邏輯能力，組合出符合答案的算式，與對手一較高下吧！考驗你的邏輯能力，組合出符合答案的算式，與對手一較高下吧！考驗你的邏輯能力，組合出符合答案的算式，與對手一較高下吧！考驗你的邏輯能力，組合出符合答案的算式，與對手一較高下吧！',
    image_url: '/chinese_chess/home.png',
    estimate_time: 30,
    create_at: 'September 14, 2022',
    max_players: 4,
  },
];
