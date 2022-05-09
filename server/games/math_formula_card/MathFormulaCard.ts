import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../../room';
import { Metadata } from '../../../domain/models/Room';
import MathFormulaCardState from './state/MathFormulaCardState';
import ResetCommand from './commands/ResetCommand';
import { RoomMessage } from '../../../domain/models/Message';
import CreateGameCommand from './commands/CreateGameCommand';
import { MathFormulaCardMessage } from '../../../features/math_formula_card/models/MathFormulaCardMessage';
import UseCardsCommand from './commands/UseCardsCommand';
import { IPlayerCard } from './state/PlayerCardState';
import DrawCardCommand from './commands/DrawCardCommand';
import RoomState from '../../room/state/RoomState';

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
      MathFormulaCardMessage.UseCards,
      (client, message: { cards: IPlayerCard[] }) => {
        this.dispatcher.dispatch(new UseCardsCommand(), {
          client,
          cards: message.cards,
        });
      }
    );

    this.onMessage(MathFormulaCardMessage.DrawCard, (client) => {
      this.dispatcher.dispatch(new DrawCardCommand(), {
        client,
      });
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
