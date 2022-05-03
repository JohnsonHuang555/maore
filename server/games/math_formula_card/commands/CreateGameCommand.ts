import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import { Client } from 'colyseus';
import Random from '../../../utils/Random';
import MathFormulaCardState from '../state/MathFormulaCardState';
import { CardSymbol, PlayerCardState } from '../state/PlayerCardState';
import { PlayerInfoState } from '../state/PlayerInfoState';

export default class CreateGameCommand extends Command<MathFormulaCardState> {
  execute() {
    // 產隨機答案後寫入
    const answer = Random.getRangeNumbers(0, 100, 1);
    this.room.state.answer = answer[0];
    const playerIds = this.room.state.players.map((p) => p.id);
    console.log(this.state.players.length);
    playerIds.forEach((id) => {
      console.log('in', id);
      const cards = new ArraySchema<PlayerCardState>();
      // FIXME: 假資料
      cards.push(
        new PlayerCardState({
          id: '1',
          cardNumber: 1,
        })
      );
      cards.push(
        new PlayerCardState({
          id: '2',
          cardNumber: 3,
        })
      );
      cards.push(
        new PlayerCardState({
          id: '3',
          cardSymbol: CardSymbol.Plus,
        })
      );
      cards.push(
        new PlayerCardState({
          id: '4',
          cardSymbol: CardSymbol.Divide,
        })
      );
      this.room.state.playerInfos.set(id, new PlayerInfoState({ cards }));
    });
  }
}
