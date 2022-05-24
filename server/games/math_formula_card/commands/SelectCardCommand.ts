import { Command } from '@colyseus/command';
import {
  MathSymbol,
  SelectedElementsState,
} from '../state/SelectedElementsState';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  playerId: string;
  cardId: string;
};

export default class SelectCardCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { playerId, cardId } = data;
    const cards = this.state.mathFormulaCard.playerInfos.get(playerId)?.cards;
    // const playerCard = cards?.find((card) => card.id === cardId);
    // if (!playerCard) {
    //   throw new Error('playerCard not found');
    // }

    // this.state.mathFormulaCard.selectedCards =
    //   this.state.mathFormulaCard.selectedCards.clone(true);

    // const isExistIndex = this.state.mathFormulaCard.selectedCards.findIndex(
    //   (card) => card.id === playerCard.id
    // );

    // // 如果是括號，要另外處理
    // if (
    //   playerCard.cardSymbol &&
    //   playerCard.cardSymbol === CardSymbol.Parentheses
    // ) {
    //   if (isExistIndex !== -1) {
    //     const rightIndex = this.state.mathFormulaCard.selectedCards.findIndex(
    //       (card) =>
    //         card.id === playerCard.id &&
    //         card.cardSymbol === SelectCardSymbol.RightParentheses
    //     );
    //     this.state.mathFormulaCard.selectedCards.splice(rightIndex, 1);
    //     const leftIndex = this.state.mathFormulaCard.selectedCards.findIndex(
    //       (card) =>
    //         card.id === playerCard.id &&
    //         card.cardSymbol === SelectCardSymbol.LeftParentheses
    //     );
    //     this.state.mathFormulaCard.selectedCards.splice(leftIndex, 1);
    //   } else {
    //     this.state.mathFormulaCard.selectedCards.push(
    //       new selectedElementsState({
    //         id: playerCard.id,
    //         cardSymbol: SelectCardSymbol.RightParentheses,
    //       })
    //     );

    //     this.state.mathFormulaCard.selectedCards.unshift(
    //       new selectedElementsState({
    //         id: playerCard.id,
    //         cardSymbol: SelectCardSymbol.LeftParentheses,
    //       })
    //     );
    //   }
    //   return;
    // }

    // if (isExistIndex !== -1) {
    //   this.state.mathFormulaCard.selectedCards.splice(isExistIndex, 1);
    // } else {
    //   this.state.mathFormulaCard.selectedCards.push(
    //     new selectedElementsState({
    //       id: playerCard.id,
    //       cardNumber: playerCard.cardNumber,
    //       cardSymbol: playerCard.cardSymbol as unknown as SelectCardSymbol,
    //     })
    //   );
    // }
  }
}
