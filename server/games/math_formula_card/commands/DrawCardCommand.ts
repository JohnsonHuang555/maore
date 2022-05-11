import { Command } from '@colyseus/command';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import { Client } from 'colyseus';
import {
  CardSymbol,
  CardSymbols,
  PlayerCardState,
} from '../state/PlayerCardState';
import short from 'short-uuid';
import Random from '../../../utils/Random';
import RoomState from '../../../room/state/RoomState';
import { ArraySchema } from '@colyseus/schema';
import ClearSelectedCardsCommand from './ClearSelectedCardsCommand';

type Payload = {
  client: Client;
};

export default class DrawCardCommand extends Command<RoomState> {
  execute(data: Payload) {
    const playerInfo = this.room.state.mathFormulaCard.playerInfos.get(
      data.client.id
    );
    if (!playerInfo) {
      throw new Error('playerInfo not found...');
    }
    const card = Random.getRandomValuesByArray(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...CardSymbols],
      1
    );

    if (!isNaN(Number(card[0]))) {
      playerInfo.cards.push(
        new PlayerCardState({
          id: short.generate(),
          cardNumber: card[0] as number,
        })
      );
    } else {
      playerInfo.cards.push(
        new PlayerCardState({
          id: short.generate(),
          cardSymbol: card[0] as CardSymbol,
        })
      );
    }
    // 抽完牌換下一位玩家
    return [new ClearSelectedCardsCommand(), new NextTurnCommand()];
  }
}
