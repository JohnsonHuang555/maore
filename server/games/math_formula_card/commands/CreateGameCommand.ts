import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import Random from '../../../utils/Random';
import MathFormulaCardState from '../state/MathFormulaCardState';
import { PlayerCardState } from '../state/PlayerCardState';

export default class CreateGameCommand extends Command<MathFormulaCardState> {
  execute() {
    const answer = Random.getRangeNumbers(0, 100, 1);
    this.room.state.answer = answer[0];
    // const playerIds = this.room.state.players.map(p => p.id);
    // playerIds.forEach(id => {
    //   const cards = new ArraySchema<PlayerCardState>();
    //   cards.push(
    //     new PlayerCardState({
    //       cardNumber: 1,
    //     })
    //   );
    //   this.room.state.playerCards.set(id, cards);
    // })
  }
}
