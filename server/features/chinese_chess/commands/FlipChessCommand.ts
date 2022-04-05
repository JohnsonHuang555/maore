import { Command } from '@colyseus/command';
import NextTurnCommand from '../../base/commands/NextTurnCommand';
import ChineseChessState from '../state/ChineseChessState';

type Payload = {
  chessIndex: number;
};

export default class FlipChessCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { chessIndex } = data;
    this.room.state.chineseChesses[chessIndex].isFlipped = true;
    return [new NextTurnCommand()];
  }
}
