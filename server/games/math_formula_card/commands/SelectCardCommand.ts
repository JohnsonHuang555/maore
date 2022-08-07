import { Command } from '@colyseus/command';
import MathFormulaCard from '../MathFormulaCard';
import { PlayerCardState } from '../state/PlayerCardState';
import { MathSymbol } from '../state/SelectedElementsState';
import short from 'short-uuid';

type Payload = {
  playerId: string;
  cardId: string;
  targetId: string;
  mathSymbol?: MathSymbol;
};

export default class SelectCardCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { playerId, cardId, targetId, mathSymbol } = data;
    const playerInfo = this.state.mathFormulaCard.playerInfos.get(playerId);
    if (!playerInfo) {
      throw new Error('playerInfo not found');
    }
    const cardIndex = playerInfo.cards.findIndex((card) => card.id === cardId);
    if (cardIndex === undefined) {
      throw new Error('playerCard not found');
    }

    // 拖曳牌的 index
    const dropZoneIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (selectedElement) => selectedElement.cardId === cardId
    );

    console.log(dropZoneIndex, 'drop');

    // 目標區塊的 index
    const targetIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (selectedElement) => selectedElement.id === targetId
    );

    console.log(targetIndex, 'target');

    // 判斷是不是拖曳符號卡
    const isMathSymbolCard = !!mathSymbol;

    if (
      dropZoneIndex === -1 &&
      !this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      console.log('FromHand');
      // FromHand
      if (isMathSymbolCard) {
        // 寫入格子
        this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
          mathSymbol;
        // 寫入 id
        this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
          cardId;
        const canUseMathSymbolIndex =
          this.state.mathFormulaCard.canUseMathSymbols.findIndex(
            (s) => s.mathSymbol === mathSymbol
          );
        const newId = short.generate();
        this.state.mathFormulaCard.canUseMathSymbols[canUseMathSymbolIndex].id =
          newId;
      } else {
        // 寫入格子
        this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
          playerInfo.cards[cardIndex].cardNumber;
        // 寫入 id
        this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
          playerInfo.cards[cardIndex].id;

        // 移除手牌的卡
        playerInfo.cards.splice(cardIndex, 1);
      }
    } else if (
      dropZoneIndex === -1 &&
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      console.log('FromHandExchange');

      const cardNumber = this.state.mathFormulaCard.selectedElements[
        targetIndex
      ].cardNumber as number;

      // FromHandExchange
      if (isMathSymbolCard) {
        // 目標是符號
        if (
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol
        ) {
          // 寫入格子
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
            mathSymbol;
        }
        // 目標是數字
        else if (
          this.state.mathFormulaCard.selectedElements[targetIndex]
            .cardNumber !== undefined &&
          this.state.mathFormulaCard.selectedElements[targetIndex]
            .cardNumber !== -1
        ) {
          // 寫入格子
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
            mathSymbol;
          this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
            -1;

          playerInfo.cards.push(
            new PlayerCardState({ id: cardId, cardNumber })
          );
        }
        // 寫入 id
        this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
          cardId;
        const canUseMathSymbolIndex =
          this.state.mathFormulaCard.canUseMathSymbols.findIndex(
            (s) => s.mathSymbol === mathSymbol
          );
        const newId = short.generate();
        this.state.mathFormulaCard.canUseMathSymbols[canUseMathSymbolIndex].id =
          newId;
      } else {
        // 數字卡互換才使用 targetID
        const cardId = this.state.mathFormulaCard.selectedElements[targetIndex]
          .cardId as string;
        // 目標是符號
        if (
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol
        ) {
          // 寫入格子
          this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
            playerInfo.cards[cardIndex].cardNumber;
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
            '';
        }
        // 目標是數字
        else if (
          this.state.mathFormulaCard.selectedElements[targetIndex]
            .cardNumber !== undefined &&
          this.state.mathFormulaCard.selectedElements[targetIndex]
            .cardNumber !== -1
        ) {
          // 寫入格子
          this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
            playerInfo.cards[cardIndex].cardNumber;

          playerInfo.cards.push(
            new PlayerCardState({ id: cardId, cardNumber })
          );
        }

        // 寫入 id
        this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
          playerInfo.cards[cardIndex].id;

        // 移除手牌
        playerInfo.cards.splice(cardIndex, 1);
      }
    } else if (
      dropZoneIndex !== -1 &&
      !this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      console.log('ExchangeOnEmptyDropZone');
      // ExchangeOnEmptyDropZone
      if (isMathSymbolCard) {
        // 寫入格子
        this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
          this.state.mathFormulaCard.selectedElements[dropZoneIndex].mathSymbol;

        // clear dropzone
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardNumber =
          -1;
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].mathSymbol =
          '';
      } else {
        // 寫入格子
        this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
          this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardNumber;

        // clear dropzone
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardNumber =
          -1;
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].mathSymbol =
          '';
      }

      // 寫入 id
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardId;
      this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardId = '';
    } else if (
      dropZoneIndex !== -1 &&
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId
    ) {
      console.log('ExchangeOnDropZone');
      // ExchangeOnDropZone
      const tempNumber =
        this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber;
      const tempSymbol =
        this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol;
      const tempCardId =
        this.state.mathFormulaCard.selectedElements[targetIndex].cardId;

      if (isMathSymbolCard) {
        // 目標是符號
        if (tempSymbol) {
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
            this.state.mathFormulaCard.selectedElements[
              dropZoneIndex
            ].mathSymbol;

          this.state.mathFormulaCard.selectedElements[
            dropZoneIndex
          ].mathSymbol = tempSymbol;
        }
        // 目標是數字 包含 0 所以要判斷 undefined
        else if (tempNumber !== undefined && tempNumber !== -1) {
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
            this.state.mathFormulaCard.selectedElements[
              dropZoneIndex
            ].mathSymbol;
          this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
            -1;

          this.state.mathFormulaCard.selectedElements[
            dropZoneIndex
          ].cardNumber = tempNumber;
          this.state.mathFormulaCard.selectedElements[
            dropZoneIndex
          ].mathSymbol = '';
        }
      } else {
        // 目標是符號
        if (tempSymbol) {
          this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
            this.state.mathFormulaCard.selectedElements[
              dropZoneIndex
            ].cardNumber;
          this.state.mathFormulaCard.selectedElements[targetIndex].mathSymbol =
            '';

          this.state.mathFormulaCard.selectedElements[
            dropZoneIndex
          ].cardNumber = -1;
          this.state.mathFormulaCard.selectedElements[
            dropZoneIndex
          ].mathSymbol = tempSymbol;
        }
        // 目標是數字 包含 0 所以要判斷 undefined
        else if (tempNumber !== undefined && tempNumber !== -1) {
          this.state.mathFormulaCard.selectedElements[targetIndex].cardNumber =
            this.state.mathFormulaCard.selectedElements[
              dropZoneIndex
            ].cardNumber;

          this.state.mathFormulaCard.selectedElements[
            dropZoneIndex
          ].cardNumber = tempNumber;
        }
      }

      // 寫入 id
      this.state.mathFormulaCard.selectedElements[targetIndex].cardId =
        this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardId;
      this.state.mathFormulaCard.selectedElements[dropZoneIndex].cardId =
        tempCardId;
    }
  }
}
