import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChessState from '../state/ChineseChessState';
import { GameMode } from '../../../../features/chinese_chess/models/ChinesChessMode';
import {
  ChessNameRed,
  ChessNameBlack,
} from '../../../../features/chinese_chess/models/ChineseChessName';
import { ChineseChessGroup } from '../../../../features/chinese_chess/models/ChineseChessGroup';
import { ChessSide } from '../../../../features/chinese_chess/models/ChineseChessSide';

type Payload = {
  gameMode: GameMode;
  group: ChineseChessGroup;
};

export default class CheckWinnerCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { gameMode, group } = data;

    switch (gameMode) {
      case GameMode.Standard: {
        let isKingDead = undefined;
        if (group === ChineseChessGroup.Black) {
          // 檢查對方的將軍還有沒有存活
          isKingDead = this.state.chineseChesses.find(
            (c) => c.name === ChessNameRed.King && !c.alive
          );
        } else {
          // 檢查對方的將軍還有沒有存活
          isKingDead = this.state.chineseChesses.find(
            (c) => c.name === ChessNameBlack.King && !c.alive
          );
        }

        if (isKingDead) {
          // 贏家勝出
          this.state.winningPlayer = this.state.activePlayer;
        } else {
          return [new NextTurnCommand()];
        }
      }
      case GameMode.Hidden: {
        const chessSide =
          group === ChineseChessGroup.Black ? ChessSide.Black : ChessSide.Red;
        // 檢查對方的棋子數還有沒有存活
        const anotherRemainChess = this.state.chineseChesses.find(
          (c) => c.chessSide !== chessSide && c.alive
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
