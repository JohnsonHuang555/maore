import { Command } from '@colyseus/command';
import ChineseChess from '../ChineseChess';

type Payload = {
  id: number;
  targetId: number;
};

export default class EatChessCommand extends Command<ChineseChess> {
  execute(data: Payload) {
    const { id, targetId } = data;
    // const chessIndex = this.room.state.chineseChess.chineseChesses.findIndex(
    //   (c) => c.id === id
    // );
    // const targetChessIndex =
    //   this.room.state.chineseChess.chineseChesses.findIndex(
    //     (c) => c.id === targetId
    //   );
    // this.room.state.chineseChess.chineseChesses[targetChessIndex].alive = false;
    // this.room.state.chineseChess.chineseChesses[chessIndex].locationX =
    //   this.room.state.chineseChess.chineseChesses[targetChessIndex].locationX;
    // this.room.state.chineseChess.chineseChesses[chessIndex].locationY =
    //   this.room.state.chineseChess.chineseChesses[targetChessIndex].locationY;
  }
}
