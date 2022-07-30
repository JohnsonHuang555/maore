import { Command } from '@colyseus/command';
import MathFormulaCard from '../MathFormulaCard';
import Random from '../../../utils/Random';
import { SelectedElementsState } from '../state/SelectedElementsState';
import short from 'short-uuid';
import { ArraySchema } from '@colyseus/schema';

export default class CreateAnswerCommand extends Command<MathFormulaCard> {
  execute() {
    // 清空 selectedElements
    this.room.state.mathFormulaCard.selectedElements =
      new ArraySchema<SelectedElementsState>();

    // 產隨機答案後寫入 0 ~ 10
    const answer = Random.getRangeNumbers(0, 10, 1);
    // 依照模式去產幾個答案，目前先產一個
    this.room.state.mathFormulaCard.answer = answer[0];

    // 玩家需要使用的牌數
    const canUseCards = Random.getRangeNumbers(3, 7, 1);
    for (let i = 0; i < canUseCards[0]; i++) {
      this.room.state.mathFormulaCard.selectedElements.push(
        new SelectedElementsState({
          id: short.generate(),
        })
      );
    }
  }
}
