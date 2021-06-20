import type Server from 'features/tictactoe/TicTacToeServer';

export type GameOverSceneData = {
  winner: boolean;
  onRestart?: () => void;
  onClose?: () => void;
};

export type GameSceneData = {
  server: Server;
  onGameOver: (data: GameOverSceneData) => void;
};
