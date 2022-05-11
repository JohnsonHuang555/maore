import { Command } from '@colyseus/command';
import RoomState from '../../../room/state/RoomState';
import { CardSymbol } from '../state/PlayerCardState';
import {
  SelectCardSymbol,
  SelectedCardState,
} from '../state/SelectedCardState';
import { ArraySchema } from '@colyseus/schema';

type Payload = {
  playerId: string;
  cardId: string;
};

export default class SelectCardCommand extends Command<RoomState> {
  execute(data: Payload) {
    const { playerId, cardId } = data;
    const cards = this.state.mathFormulaCard.playerInfos.get(playerId)?.cards;
    const playerCard = cards?.find((card) => card.id === cardId);
    if (!playerCard) {
      throw new Error('playerCard not found');
    }

    const isExistIndex = this.state.mathFormulaCard.selectedCards.findIndex(
      (card) => card.id === playerCard.id
    );

    // 如果是括號，要另外處理
    if (
      playerCard.cardSymbol &&
      playerCard.cardSymbol === CardSymbol.Parentheses
    ) {
      if (isExistIndex !== -1) {
        const rightIndex = this.state.mathFormulaCard.selectedCards.findIndex(
          (card) =>
            card.id === playerCard.id &&
            card.cardSymbol === SelectCardSymbol.RightParentheses
        );
        this.state.mathFormulaCard.selectedCards.splice(rightIndex, 1);
        const leftIndex = this.state.mathFormulaCard.selectedCards.findIndex(
          (card) =>
            card.id === playerCard.id &&
            card.cardSymbol === SelectCardSymbol.LeftParentheses
        );
        this.state.mathFormulaCard.selectedCards.splice(leftIndex, 1);
      } else {
        this.state.mathFormulaCard.selectedCards.unshift(
          new SelectedCardState({
            id: playerCard.id,
            cardSymbol: SelectCardSymbol.LeftParentheses,
          })
        );
        this.state.mathFormulaCard.selectedCards.push(
          new SelectedCardState({
            id: playerCard.id,
            cardSymbol: SelectCardSymbol.RightParentheses,
          })
        );

        console.log(
          this.state.mathFormulaCard.selectedCards[0].cardSymbol,
          this.state.mathFormulaCard.selectedCards[1].cardSymbol
        );
      }
      return;
    }

    if (isExistIndex !== -1) {
      this.state.mathFormulaCard.selectedCards.splice(isExistIndex, 1);
    } else {
      const cardLength = this.state.mathFormulaCard.selectedCards.length;
      this.state.mathFormulaCard.selectedCards.push(
        new SelectedCardState({
          id: playerCard.id,
          cardNumber: playerCard.cardNumber,
          cardSymbol: playerCard.cardSymbol as unknown as SelectCardSymbol,
        })
      );
    }
  }
}
