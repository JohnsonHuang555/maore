import { Command } from '@colyseus/command';
import MathFormulaCard from '../MathFormulaCard';
import { Client } from 'colyseus';
import { PlayerCardState } from '../state/PlayerCardState';

type Payload = {
  client: Client;
  isDrawCard: boolean;
};

// 清空答案區，並依據 isDrawCard 把牌回覆到玩家上
export default class ClearSelectedElementsCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { client, isDrawCard } = data;
    const playerInfo = this.room.state.mathFormulaCard.playerInfos.get(
      client.id
    );
    if (!playerInfo) {
      throw new Error('playerInfo not found...');
    }
    this.room.state.mathFormulaCard.selectedElements.forEach((element) => {
      if (
        isDrawCard &&
        element.cardId !== undefined &&
        element.cardId !== '' &&
        element.cardNumber !== undefined &&
        element.cardNumber !== -1
      ) {
        playerInfo.cards.push(
          new PlayerCardState({
            id: element.cardId,
            cardNumber: element.cardNumber,
          })
        );
        element.cardId = '';
      }
      element.cardNumber = -1;
      element.mathSymbol = '';
    });
  }
}
