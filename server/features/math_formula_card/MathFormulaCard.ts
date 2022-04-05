import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../base';
import { Game, GameList } from '../../../domain/models/Game';
import { Metadata } from '../../../domain/models/Room';
import MathFormulaCardState from './state/MathFormulaCardState';
// import GameUseCase from '../../domain/usecases/GameUseCase';
import ResetCommand from './commands/ResetCommand';
import { RoomMessage } from '../../../domain/models/Message';
import CreateGameCommand from './commands/CreateGameCommand';

export default class MathFormulaCard extends Room<MathFormulaCardState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);
  // private game: Game = GameUseCase.getGameByGamePack(GameList.MathFormulaCard);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    // this.baseRoom.setMaxClient(this.game.maxPlayers as number);
    this.setState(new MathFormulaCardState());

    this.onMessage(RoomMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand());
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