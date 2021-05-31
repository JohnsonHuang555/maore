import { GameList } from 'models/Game';
import TicTacToe from 'features/tictactoe/TicTacToe';
import styles from 'styles/components/gameScreen.module.scss';
import { GameState } from 'models/Room';
import { CSSProperties } from 'react';

type GameSreenProps = {
  gameStatus: GameState;
  gamePack: GameList | '';
};

/** 決定要使用的遊戲 */
const GameScreen = (props: GameSreenProps) => {
  const { gameStatus, gamePack } = props;

  const playingGame: { [key: string]: JSX.Element } = {
    [GameList.TicTacToe]: <TicTacToe />,
  };

  const showScreen: CSSProperties =
    gameStatus === GameState.Playing
      ? { display: 'flex' }
      : { display: 'none' };

  return (
    <div style={showScreen} className={styles.gameScreen}>
      {playingGame[gamePack]}
    </div>
  );
};

export default GameScreen;
