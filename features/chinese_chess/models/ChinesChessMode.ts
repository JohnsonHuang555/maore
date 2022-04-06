export enum GameMode {
  Standard = 'standard',
  Hidden = 'hidden',
}

export const enhanceGameModes: { [key: string]: string } = {
  [GameMode.Standard]: '標準(大盤)',
  [GameMode.Hidden]: '暗棋(小盤)',
};
