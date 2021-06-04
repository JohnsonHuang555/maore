import type Server from 'features/tictactoe/Server';

export type GameOverSceneData = {
  winner: boolean;
  onRestart?: () => void;
};

export type GameSceneData = {
  server: Server;
  onGameOver: (data: GameOverSceneData) => void;
};
