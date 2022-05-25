import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import MathFormulaCard from '../MathFormulaCard';
import { SelectedElementsState } from '../state/SelectedElementsState';

export default class ClearselectedElementssCommand extends Command<MathFormulaCard> {
  execute() {
    this.room.state.mathFormulaCard.selectedElements =
      new ArraySchema<SelectedElementsState>();
  }
}
