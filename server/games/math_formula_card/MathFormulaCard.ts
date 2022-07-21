import { Client, Room } from 'colyseus';
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
import ClearSelectedCardsCommand from './commands/ClearSelectedCardsCommand';
import UpdateGameSettingsCommand from './commands/UpdateGameSettingsCommand';
import { MathSymbol } from './state/SelectedElementsState';
import SelectSymbolCommand from './commands/SelectSymbolCommand';

export default class MathFormulaCard extends Room<RoomState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    // 最多四人
    this.baseRoom.setMaxClient(4);
    this.setState(new RoomState());

    this.onMessage(RoomMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand());
    });

    this.onMessage(
      RoomMessage.UpdateGameSettings,
      (_c, message: { winnerPoint: number }) => {
        this.dispatcher.dispatch(new UpdateGameSettingsCommand(), {
          winnerPoint: message.winnerPoint,
        });
      }
    );

    this.onMessage(MathFormulaCardMessage.UseCards, (client) => {
      this.dispatcher.dispatch(new UseCardsCommand(), {
        client,
      });
    });

    this.onMessage(MathFormulaCardMessage.DrawCard, (client) => {
      this.dispatcher.dispatch(new DrawCardCommand(), {
        client,
      });
    });

    this.onMessage(
      MathFormulaCardMessage.SelectCardNumber,
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

    this.onMessage(
      MathFormulaCardMessage.SelectMathSymbol,
      (_c, message: { mathSymbol: MathSymbol }) => {
        this.dispatcher.dispatch(new SelectSymbolCommand(), {
          mathSymbol: message.mathSymbol,
        });
      }
    );

    this.onMessage(MathFormulaCardMessage.ClearSelectedCards, () => {
      this.dispatcher.dispatch(new ClearSelectedCardsCommand());
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
