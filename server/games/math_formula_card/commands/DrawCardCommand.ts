import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { PlayerCardState } from '../state/PlayerCardState';
import short from 'short-uuid';
import Random from '../../../utils/Random';
import ClearSelectedElementsCommand from './ClearSelectedElementsCommand';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  client: Client;
};

export default class DrawCardCommand extends Command<MathFormulaCard, Payload> {
  execute({ client }: Payload) {
    const playerInfo = this.room.state.mathFormulaCard.playerInfos.get(
      client.id
    );
    if (!playerInfo) {
      throw new Error('playerInfo not found...');
    }
    const card = Random.getRandomValuesByArray(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      1
    );

    playerInfo.cards.push(
      new PlayerCardState({
        id: short.generate(),
        cardNumber: card[0],
      })
    );
    // 抽完牌換下一位玩家
    return [
      new ClearSelectedElementsCommand().setPayload({
        client,
        isDrawCard: true,
      }),
    ];
  }
}
