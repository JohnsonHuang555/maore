import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import Random from '../../../utils/Random';
import MathFormulaCardState from '../state/MathFormulaCardState';
import { CardSymbols, PlayerCardState } from '../state/PlayerCardState';
import { PlayerInfoState } from '../state/PlayerInfoState';
import short from 'short-uuid';

export default class CreateGameCommand extends Command<MathFormulaCardState> {
  execute() {
    // 產隨機答案後寫入
    const answer = Random.getRangeNumbers(0, 100, 1);
    this.room.state.answer = answer[0];

    // 發牌 產四張數字牌、三張符號牌
    const playerIds = this.room.state.players.map((p) => p.id);
    playerIds.forEach((id) => {
      const fourNumbers = Random.getRangeNumbers(0, 9, 4);
      const threeSymbols = Random.getRandomValuesByArray(CardSymbols, 3);
      const cards = new ArraySchema<PlayerCardState>();
      fourNumbers.forEach((cardNumber) => {
        cards.push(
          new PlayerCardState({
            id: short.generate(),
            cardNumber,
          })
        );
      });
      threeSymbols.forEach((cardSymbol) => {
        cards.push(
          new PlayerCardState({
            id: short.generate(),
            cardSymbol,
          })
        );
      });
      this.room.state.playerInfos.set(
        id,
        new PlayerInfoState({ cards, point: 0 })
      );
    });
  }
}
