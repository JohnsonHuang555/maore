import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import ChineseChessState from '../state/ChineseChessState';

type Payload = {
  id: number;
  targetId: number;
};

export default class EatChessCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { id, targetId } = data;
    const chessIndex = this.room.state.chineseChesses.findIndex(
      (c) => c.id === id
    );
    const targetChessIndex = this.room.state.chineseChesses.findIndex(
      (c) => c.id === targetId
    );
    this.room.state.chineseChesses[targetChessIndex].alive = false;
    this.room.state.chineseChesses[chessIndex].locationX =
      this.room.state.chineseChesses[targetChessIndex].locationX;
    this.room.state.chineseChesses[chessIndex].locationY =
      this.room.state.chineseChesses[targetChessIndex].locationY;
  }
}
