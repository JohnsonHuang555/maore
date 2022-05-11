import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import RoomState from '../../../room/state/RoomState';
import { SelectedCardState } from '../state/SelectedCardState';

export default class ClearSelectedCardsCommand extends Command<RoomState> {
  execute() {
    this.room.state.mathFormulaCard.selectedCards =
      new ArraySchema<SelectedCardState>();
  }
}
