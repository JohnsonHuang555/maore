import { Command } from '@colyseus/command';
import {
  MathSymbol,
  SelectedElementsState,
} from '../state/SelectedElementsState';
import MathFormulaCard from '../MathFormulaCard';
import short from 'short-uuid';

type Payload = {
  mathSymbol: MathSymbol;
};

export default class SelectSymbolCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    this.state.mathFormulaCard.selectedElements.push(
      new SelectedElementsState({
        id: short.generate(),
        mathSymbol: data.mathSymbol,
      })
    );
  }
}
