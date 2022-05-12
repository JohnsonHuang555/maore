import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import MathFormulaCard from '../MathFormulaCard';
import { SelectedCardState } from '../state/SelectedCardState';

export default class ClearSelectedCardsCommand extends Command<MathFormulaCard> {
  execute() {
    this.room.state.mathFormulaCard.selectedCards =
      new ArraySchema<SelectedCardState>();
  }
}
