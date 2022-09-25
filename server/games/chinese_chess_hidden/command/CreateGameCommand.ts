import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import short from 'short-uuid';
import Random from '../../../utils/Random';
import ChineseChessHidden from '../ChineseChessHidden';
import { ChessHiddenMap } from '../datas/ChessHiddenMap';
import { ChessInfoState } from '../state/ChessInfoState';
import { PlayerInfoState } from '../state/PlayerInfoState';

export default class CreateGameCommand extends Command<ChineseChessHidden> {
  execute() {
    // 避免重複創建
    if (this.room.state.chineseChessHidden.chesses.length) {
      return;
    }
    const chineseChesses = this.createHidden();
    this.room.state.chineseChessHidden.chesses = chineseChesses;

    const playerIds = this.room.state.players.map((p) => p.id);
    playerIds.forEach((id) => {
      const eatenChesses = new ArraySchema<ChessInfoState>();
      this.room.state.chineseChessHidden.playerInfos.set(
        id,
        new PlayerInfoState({ chessSide: '', eatenChesses: eatenChesses })
      );
    });
  }

  private createHidden(): ArraySchema<ChessInfoState> {
    const chesses = new ArraySchema<ChessInfoState>();
    const randomLocation = Random.getShuffleNumbers(0, 31);
    for (let i = 0; i < 32; i++) {
      const x = randomLocation[i] % 8;
      const y = Math.floor(randomLocation[i] / 8);
      chesses.push(
        new ChessInfoState({
          id: short.generate(),
          chessSide: ChessHiddenMap[i].side,
          name: ChessHiddenMap[i].name,
          rank: ChessHiddenMap[i].rank,
          isFlipped: false,
          alive: true,
          locationX: x,
          locationY: y,
        })
      );
    }
    return chesses;
  }
}
