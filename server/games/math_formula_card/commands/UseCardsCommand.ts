import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { evaluate } from 'mathjs';
import { MathFormulaCardMessage } from '../../../../features/math_formula_card/models/MathFormulaCardMessage';
import DrawCardCommand from './DrawCardCommand';
import Random from '../../../utils/Random';
import MathFormulaCard from '../MathFormulaCard';

type Payload = {
  client: Client;
};

export default class UseCardsCommand extends Command<MathFormulaCard, Payload> {
  execute(data: Payload) {
    const { client } = data;
    let isIllegalFormula = false;
    let isPreviousNumberZero = false;
    const cards = this.room.state.mathFormulaCard.selectedCards;

    // 第一張是 0、符號，最後一張是符號，連續兩張是符號
    cards.forEach((card) => {
      if (isPreviousNumberZero && card.cardNumber !== undefined) {
        isIllegalFormula = true;
      }
      if (card.cardNumber === 0) {
        isPreviousNumberZero = true;
      } else {
        isPreviousNumberZero = false;
      }
    });

    // 算式裡沒有用到符號為不合法
    const notIncludeSymbols = cards.filter((card) => card.cardSymbol);

    if (isIllegalFormula || notIncludeSymbols.length === 0) {
      client.send(MathFormulaCardMessage.UseCardsFailed, {
        message: '算式不合法',
      });
      return;
    }

    // 解開算式
    const combinedFormula = cards
      .map((card) => {
        if (card.cardNumber !== undefined) {
          return card.cardNumber;
        } else if (card.cardSymbol !== undefined) {
          return card.cardSymbol;
        }
      })
      .join('');

    try {
      const answer: number = evaluate(combinedFormula);

      // 判斷是否為正解 FIXME: 之後要判斷他是選哪個題目
      if (answer === this.room.state.mathFormulaCard.answer) {
        this.room.broadcast(MathFormulaCardMessage.AnswerCorrectly);
        const playerInfo = this.room.state.mathFormulaCard.playerInfos.get(
          client.id
        );
        if (!playerInfo) {
          throw new Error('playerInfo not found...');
        }
        // 加分
        playerInfo.point += cards.length;

        // 用完卡片即移除
        for (let i = 0; i < cards.length; i++) {
          const cardIndex = playerInfo.cards.findIndex(
            (card) => card.id === cards[i].id
          );
          playerInfo.cards.splice(cardIndex, 1);
        }

        // 產隨機答案後寫入
        const answer = Random.getRangeNumbers(0, 100, 1);
        // 依照模式去產幾個答案，目前先產一個
        this.room.state.mathFormulaCard.answer = answer[0];

        // 抽牌
        return [new DrawCardCommand().setPayload({ client })];
      } else {
        client.send(MathFormulaCardMessage.AnsweredWrong);
      }
    } catch (e) {
      client.send(MathFormulaCardMessage.UseCardsFailed, {
        message: '算式不合法',
      });
    }
  }
}
