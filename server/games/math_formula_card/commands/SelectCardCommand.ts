import { Command } from '@colyseus/command';
import { SelectedElementsState } from '../state/SelectedElementsState';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  playerId: string;
  cardId: string;
  targetId: string;
};

export default class SelectCardCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { playerId, cardId, targetId } = data;
    const cards = this.state.mathFormulaCard.playerInfos.get(playerId)?.cards;
    const cardIndex = cards?.findIndex((card) => card.id === cardId);
    if (!cards || cardIndex === undefined) {
      throw new Error('playerCard not found');
    }

    // 移除手牌的卡
    this.state.mathFormulaCard.selectedElements.splice(cardIndex, 1);

    // 放到區塊上
    const targetIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (selectedCard) => selectedCard.id === targetId
    );
    this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
      cards[cardIndex].cardNumber;
  }
}
