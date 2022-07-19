import { Command } from '@colyseus/command';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  playerId: string;
  cardId: string;
  targetId: string;
};

export default class SelectCardCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { playerId, cardId, targetId } = data;
    const playerInfo = this.state.mathFormulaCard.playerInfos.get(playerId);
    if (!playerInfo) {
      throw new Error('playerInfo not found');
    }
    const cardIndex = playerInfo.cards.findIndex((card) => card.id === cardId);
    if (cardIndex === undefined) {
      throw new Error('playerCard not found');
    }

    // 放到區塊上
    const targetIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (selectedCard) => selectedCard.id === targetId
    );
    this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
      playerInfo.cards[cardIndex].cardNumber;
    this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
      playerInfo.cards[cardIndex].id;

    console.log(
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    );

    // 移除手牌的卡
    playerInfo.cards.splice(cardIndex, 1);
  }
}
