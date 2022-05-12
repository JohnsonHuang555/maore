import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import Random from '../../../utils/Random';
import { CardSymbols, PlayerCardState } from '../state/PlayerCardState';
import { PlayerInfoState } from '../state/PlayerInfoState';
import short from 'short-uuid';
import RoomState from '../../../room/state/RoomState';
import MathFormulaCard from '../MathFormulaCard';

export default class CreateGameCommand extends Command<MathFormulaCard> {
  execute() {
    // 產隨機答案後寫入
    const answer = Random.getRangeNumbers(0, 100, 1);
    // 依照模式去產幾個答案，目前先產一個
    this.room.state.mathFormulaCard.answer = answer[0];

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
      this.room.state.mathFormulaCard.playerInfos.set(
        id,
        new PlayerInfoState({ cards, point: 0 })
      );
    });
  }
}
