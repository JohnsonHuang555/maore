export enum GameMode {
  Standard = 'standard',
  Hidden = 'hidden',
}

export const EnhanceGameModes = [
  {
    label: '標準(大盤)',
    value: GameMode.Standard,
    image: '/chinese_chess/standard.png',
    minPlayers: 2,
    maxPlayers: 2,
  },
  {
    label: '暗棋(小盤)',
    value: GameMode.Hidden,
    image: '/chinese_chess/hidden.png',
    minPlayers: 2,
    maxPlayers: 2,
  },
];
