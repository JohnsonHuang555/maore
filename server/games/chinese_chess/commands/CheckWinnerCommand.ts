import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChessState from '../state/ChineseChessState';
import { GameMode } from '../../../../features/chinese_chess/models/ChinesChessMode';
import { ChessSide } from '../../../../features/chinese_chess/models/ChineseChessSide';

type Payload = {
  gameMode: GameMode;
  group: ChessSide;
};

export default class CheckWinnerCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { gameMode, group } = data;

    switch (gameMode) {
      case GameMode.Standard: {
        return [new NextTurnCommand()];
      }
      case GameMode.Hidden: {
        // 檢查對方的棋子數還有沒有存活
        const anotherRemainChess = this.state.chineseChesses.find(
          (c) => c.chessSide !== group && c.alive
        );

        if (anotherRemainChess) {
          return [new NextTurnCommand()];
        }
        // 贏家勝出
        this.state.winningPlayer = this.state.activePlayer;
      }
    }
  }
}
