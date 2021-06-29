import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChessState from '../state/ChineseChessState';

type Payload = {
  id: number;
};

export default class FlipChessCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { id } = data;
    const chessIndex = this.room.state.chineseChesses.findIndex(
      (c) => c.id === id
    );

    this.room.state.chineseChesses[chessIndex].isFlipped = true;
    return [new NextTurnCommand()];
  }
}
