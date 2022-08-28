import { Game, GamePack } from '../domain/Game';

// TODO: 假資料之後寫入資料庫
export const Games: Game[] = [
  // {
  //   id: 2,
  //   name: '象棋',
  //   brief: '經典遊戲',
  //   description:
  //     '象棋是中國大陸、香港、台灣、馬來西亞、新加坡、越南、琉球地區所流行的傳統的2人對弈棋類遊戲。中國大陸為了進行區分稱此為中國象棋，將西方的「Chess」稱為國際象棋；台灣將「Chess」翻譯為「西洋棋」。 中國象棋與西洋棋及圍棋並列世界三大棋類之一，類似的有韓國將棋、日本將棋等。',
  //   image_url: '/chinese_chess/home.png',
  //   estimate_time: 5,
  //   create_at: 'September 14, 2021',
  //   modes: [
  //     {
  //       name: ChineseChessMode.Standard,
  //       image_url: '/chinese_chess/standard.png',
  //       min_players: 2,
  //       max_players: 2,
  //     },
  //     {
  //       name: ChineseChessMode.Hidden,
  //       image_url: '/chinese_chess/hidden.png',
  //       min_players: 2,
  //       max_players: 2,
  //     },
  //   ],
  //   game_pack: GamePack.ChineseChess,
  // },
  {
    id: 3,
    name: '數學算式牌',
    brief:
      '原創遊戲，考驗你的邏輯能力，組合出符合答案的算式，與對手一較高下吧！',
    description: '考驗你的邏輯能力，組合出符合答案的算式，與對手一較高下吧！',
    image_url: '/math_formula',
    estimate_time: 30,
    create_at: 'September 14, 2022',
    min_players: 1,
    max_players: 4,
    game_pack: GamePack.MathFormulaCard,
  },
];
