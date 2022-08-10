import { Client, Room, Delayed } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../../room';
import { Metadata } from '../../../domain/models/Room';
import ResetCommand from './commands/ResetCommand';
import { RoomMessage } from '../../../domain/models/Message';
import CreateGameCommand from './commands/CreateGameCommand';
import { MathFormulaCardMessage } from '../../../features/math_formula_card/models/MathFormulaCardMessage';
import UseCardsCommand from './commands/UseCardsCommand';
import DrawCardCommand from './commands/DrawCardCommand';
import RoomState from '../../room/state/RoomState';
import SelectCardCommand from './commands/SelectCardCommand';
import ClearSelectedElementsCommand from './commands/ClearSelectedElementsCommand';
import UpdateGameSettingsCommand from './commands/UpdateGameSettingsCommand';
import { MathSymbol } from './state/SelectedElementsState';
import NextTurnCommand from '../../room/commands/NextTurnCommand';

export default class MathFormulaCard extends Room<RoomState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);
  public delayedInterval!: Delayed;

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    // 最多四人
    this.baseRoom.setMaxClient(4);
    this.setState(new RoomState());

    // 初始化遊戲
    this.onMessage(RoomMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand());
    });

    this.onMessage(RoomMessage.SetTimer, () => {
      // 計時開始
      this.clock.start();

      // 設置間隔計時並保存其引用
      // 以便後續清理工作
      this.delayedInterval = this.clock.setInterval(() => {
        this.broadcast(RoomMessage.GetTimer);
      }, 1000);

      // 60 秒過後清理計時器;
      // 這會讓計時器 *停止並銷毀*
      this.clock.setTimeout(() => {
        this.delayedInterval.clear();
        this.dispatcher.dispatch(new NextTurnCommand());
      }, 10_000);
    });

    // 更新遊戲設定
    this.onMessage(
      RoomMessage.UpdateGameSettings,
      (_c, message: { winnerPoint: number }) => {
        this.dispatcher.dispatch(new UpdateGameSettingsCommand(), {
          winnerPoint: message.winnerPoint,
        });
      }
    );

    // 出牌
    this.onMessage(MathFormulaCardMessage.UseCards, (client) => {
      this.dispatcher.dispatch(new UseCardsCommand(), {
        client,
      });
    });

    // 抽牌
    this.onMessage(MathFormulaCardMessage.DrawCard, (client) => {
      this.dispatcher.dispatch(new DrawCardCommand(), {
        client,
      });
    });

    // 拖曳卡到答案區
    this.onMessage(
      MathFormulaCardMessage.DropCard,
      (
        client,
        message: { id: string; targetId: string; mathSymbol?: MathSymbol }
      ) => {
        this.dispatcher.dispatch(new SelectCardCommand(), {
          playerId: client.id,
          cardId: message.id,
          targetId: message.targetId,
          mathSymbol: message.mathSymbol,
        });
      }
    );

    // 結束回合
    this.onMessage(MathFormulaCardMessage.EndPhase, () => {
      this.dispatcher.dispatch(new NextTurnCommand());
      // 停止計時
      this.delayedInterval.clear();
    });

    // 重選
    this.onMessage(MathFormulaCardMessage.ClearSelectedCards, (client) => {
      this.dispatcher.dispatch(new ClearSelectedElementsCommand(), {
        client,
        isDrawCard: true,
      });
    });

    // 結束遊戲
    this.onMessage(RoomMessage.FinishGame, () => {
      this.dispatcher.dispatch(new ResetCommand());
    });
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
    this.dispatcher.dispatch(new ResetCommand());
  }
}
