import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChessState from '../state/ChineseChessState';

type Payload = {
  id: number;
  targetX: number;
  targetY: number;
};

export default class MoveChessCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { id, targetX, targetY } = data;
    const chessIndex = this.room.state.chineseChesses.findIndex(
      (c) => c.id === id
    );

    this.room.state.chineseChesses[chessIndex].locationX = targetX;
    this.room.state.chineseChesses[chessIndex].locationY = targetY;
    return [new NextTurnCommand()];
  }
}
