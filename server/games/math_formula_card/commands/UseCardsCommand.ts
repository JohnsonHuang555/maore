import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import { evaluate } from 'mathjs';
import { MathFormulaCardMessage } from '../../../../features/math_formula_card/models/MathFormulaCardMessage';
import DrawCardCommand from './DrawCardCommand';
import MathFormulaCard from '../MathFormulaCard';
import CreateAnswerCommand from './CreateAnswerCommand';
import ClearSelectedElementsCommand from './ClearSelectedElementsCommand';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';

type Payload = {
  client: Client;
};

export default class UseCardsCommand extends Command<MathFormulaCard, Payload> {
  execute(data: Payload) {
    const { client } = data;
    let isIllegalFormula = false;
    let isPreviousNumberZero = false;
    const elements = this.room.state.mathFormulaCard.selectedElements;

    // 第一張是 0、符號，最後一張是符號，連續兩張是符號
    elements.forEach((card) => {
      console.log(card.cardNumber, 'number');
      console.log(card.mathSymbol, 'symbol');
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
    const notIncludeSymbols = elements.filter((card) => card.mathSymbol);

    if (isIllegalFormula || notIncludeSymbols.length === 0) {
      client.send(MathFormulaCardMessage.UseCardsFailed, {
        message: '算式不合法',
      });
      return;
    }

    // 解開算式
    const combinedFormula = elements
      .map((card) => {
        if (card.cardNumber !== undefined && card.cardNumber !== -1) {
          return card.cardNumber;
        } else if (card.mathSymbol !== undefined && card.mathSymbol !== '') {
          return card.mathSymbol;
        }
      })
      .join('');

    console.log(combinedFormula);

    try {
      const answer: number = evaluate(combinedFormula);

      // 判斷是否為正解
      if (answer === this.room.state.mathFormulaCard.answer) {
        this.room.broadcast(MathFormulaCardMessage.AnswerCorrectly);
        const playerInfo = this.room.state.mathFormulaCard.playerInfos.get(
          client.id
        );
        if (!playerInfo) {
          throw new Error('playerInfo not found...');
        }

        // TODO: 分數計算方式要改
        // 算手牌數量計算分數
        const cardNumbers = elements.filter(
          (card) => card.cardNumber !== undefined
        );
        // 加分
        playerInfo.point += cardNumbers.length;

        // 判斷勝利
        if (
          playerInfo.point >=
          this.state.mathFormulaCard.gameSettings.winnerPoint
        ) {
          this.state.winningPlayer = this.state.activePlayer;
        }

        // 產新題目清空答案區抽牌並換下一位玩家
        return [
          new CreateAnswerCommand(),
          new ClearSelectedElementsCommand().setPayload({
            client,
            isDrawCard: false,
          }),
          new DrawCardCommand().setPayload({ client }),
          new NextTurnCommand(),
        ];
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
