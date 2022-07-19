import { Command } from '@colyseus/command';
import MathFormulaCard from '../MathFormulaCard';
import { PlayerCardState } from '../state/PlayerCardState';

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

    // 目標區塊 index
    const targetIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (selectedElement) => selectedElement.id === targetId
    );

    // 拖曳牌的 index
    const dropZoneIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (selectedElement) => selectedElement.cardId === cardId
    );

    console.log(cardId, targetId);
    console.log(dropZoneIndex, 'drop');

    console.log(targetIndex, 'target');

    if (
      dropZoneIndex === -1 &&
      !this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      // FromHand
      // 寫入格子
      this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
        playerInfo.cards[cardIndex].cardNumber;
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
        playerInfo.cards[cardIndex].id;

      // 移除手牌的卡
      playerInfo.cards.splice(cardIndex, 1);
    } else if (
      dropZoneIndex === -1 &&
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      // FromHandExchange
      const cardId = this.state.mathFormulaCard.selectedElements[targetIndex]
        .cardId as string;
      const cardNumber = this.state.mathFormulaCard.selectedElements[
        targetIndex
      ].cardNumber as number;

      // 寫入格子
      this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
        playerInfo.cards[cardIndex].cardNumber;
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
        playerInfo.cards[cardIndex].id;

      // 取代手牌
      playerInfo.cards.splice(cardIndex, 1);
      playerInfo.cards.push(new PlayerCardState({ id: cardId, cardNumber }));
    } else if (
      dropZoneIndex !== -1 &&
      !this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      // ExchangeOnDropZone
      // 寫入格子
      this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardNumber;
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].id;

      this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardNumber =
        -1;
      this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardId = '';
    } else if (
      dropZoneIndex !== -1 &&
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      // ExchangeOnEmptyDropZone
    }
  }
}
