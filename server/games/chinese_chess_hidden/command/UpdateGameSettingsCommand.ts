import { Command } from '@colyseus/command';
import { GameStatus } from '../../../../domain/models/Room';
import ChineseChessHidden from '../ChineseChessHidden';

type Payload = {
  remainedSecond?: number;
  mode: string;
};

export default class UpdateGameSettingsCommand extends Command<ChineseChessHidden> {
  execute(data: Payload) {
    const { remainedSecond, mode } = data;
    // 只有在等待玩家時可以設定
    if (this.state.gameStatus === GameStatus.Playing) {
      return;
    }

    if (remainedSecond) {
      this.room.state.chineseChessHidden.gameSettings.remainedSecond =
        remainedSecond as number;
    }

    if (mode) {
      this.room.state.chineseChessHidden.gameSettings.mode = mode;
    }
  }
}
