import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChess from '../ChineseChess';

type Payload = {
  id: number;
  targetX: number;
  targetY: number;
};

export default class MoveChessCommand extends Command<ChineseChess> {
  execute(data: Payload) {
    const { id, targetX, targetY } = data;
    // const chessIndex = this.room.state.chineseChess.chineseChesses.findIndex(
    //   (c) => c.id === id
    // );

    // this.room.state.chineseChess.chineseChesses[chessIndex].locationX = targetX;
    // this.room.state.chineseChess.chineseChesses[chessIndex].locationY = targetY;
    return [new NextTurnCommand()];
  }
}
