import { Command } from '@colyseus/command';
import ResetGameCommand from '../../../room/commands/ResetGameCommand';
import { MapSchema, ArraySchema } from '@colyseus/schema';
import { PlayerInfoState } from '../state/PlayerInfoState';
import ChineseChessHidden from '../ChineseChessHidden';
import { ChessInfoState } from '../state/ChessInfoState';

export default class ResetCommand extends Command<ChineseChessHidden> {
  execute() {
    // reset
    this.room.state.chineseChessHidden.playerInfos =
      new MapSchema<PlayerInfoState>();

    this.room.state.chineseChessHidden.chesses =
      new ArraySchema<ChessInfoState>();

    return [new ResetGameCommand()];
  }
}
