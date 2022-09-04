import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChess from '../ChineseChess';

type Payload = {
  chessIndex: number;
};

export default class FlipChessCommand extends Command<ChineseChess> {
  execute(data: Payload) {
    const { chessIndex } = data;
    // this.room.state.chineseChess.chineseChesses[chessIndex].isFlipped = true;
    return [new NextTurnCommand()];
  }
}
