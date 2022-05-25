import { Command } from '@colyseus/command';
import { SelectedElementsState } from '../state/SelectedElementsState';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  playerId: string;
  cardId: string;
};

export default class SelectCardCommand extends Command<MathFormulaCard> {
  execute(data: Payload) {
    const { playerId, cardId } = data;
    const cards = this.state.mathFormulaCard.playerInfos.get(playerId)?.cards;
    const playerCard = cards?.find((card) => card.id === cardId);
    if (!playerCard) {
      throw new Error('playerCard not found');
    }

    const isExistIndex = this.state.mathFormulaCard.selectedElements.findIndex(
      (card) => card.id === playerCard.id
    );

    if (isExistIndex !== -1) {
      this.state.mathFormulaCard.selectedElements.splice(isExistIndex, 1);
    } else {
      this.state.mathFormulaCard.selectedElements.push(
        new SelectedElementsState({
          id: playerCard.id,
          cardNumber: playerCard.cardNumber,
        })
      );
    }
  }
}
