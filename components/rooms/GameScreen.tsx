import { GameList } from 'models/Game';
import TicTacToe from 'features/tictactoe/TicTacToe';
import styles from 'stylescomponents/playerList.module.scss';

type GameSreenProps = {
  gamePack: GameList;
};

/** 決定要使用的遊戲 */
const GameScreen = (props: GameSreenProps) => {
  const { gamePack } = props;

  const playingGame: { [key: string]: JSX.Element } = {
    [GameList.TicTacToe]: <TicTacToe />,
  };

  return <div className={styles.gameScreen}>{playingGame[gamePack]}</div>;
};

export default GameScreen;
