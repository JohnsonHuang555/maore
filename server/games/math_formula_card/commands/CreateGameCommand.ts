import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import Random from '../../../utils/Random';
import { PlayerCardState } from '../state/PlayerCardState';
import { PlayerInfoState } from '../state/PlayerInfoState';
import short from 'short-uuid';
import MathFormulaCard from '../MathFormulaCard';
import { MathSymbol } from '../state/SelectedElementsState';
import { MathSymbolCardState } from '../state/MathSymbolCardState';
import CreateAnswerCommand from './CreateAnswerCommand';

export default class CreateGameCommand extends Command<MathFormulaCard> {
  execute() {
    // 產生符號算式牌
    [
      MathSymbol.Plus,
      MathSymbol.Minus,
      MathSymbol.Times,
      MathSymbol.Divide,
    ].forEach((mathSymbol) => {
      this.room.state.mathFormulaCard.canUseMathSymbols.push(
        new MathSymbolCardState({
          id: short.generate(),
          mathSymbol,
        })
      );
    });

    // 發牌 隨機產八張數字牌
    const playerIds = this.room.state.players.map((p) => p.id);
    playerIds.forEach((id) => {
      const fourNumbers = Random.getRangeNumbers(0, 9, 8);
      const cards = new ArraySchema<PlayerCardState>();
      fourNumbers.forEach((cardNumber) => {
        cards.push(
          new PlayerCardState({
            id: short.generate(),
            cardNumber,
          })
        );
      });
      this.room.state.mathFormulaCard.playerInfos.set(
        id,
        new PlayerInfoState({ cards, point: 0 })
      );
    });

    // 產答案
    return [new CreateAnswerCommand()];
  }
}
