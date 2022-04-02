import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../../room';
import { Game, GameList } from '../../../models/Game';
import { Metadata } from '../../../models/Room';
import MathFormulaCardState from './state/MathFormulaCardState';
import GameUseCase from '../../usecases/GameUseCase';
import ResetCommand from './commands/ResetCommand';

export default class MathFormulaCard extends Room<MathFormulaCardState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);
  private game: Game = GameUseCase.getGameByGamePack(GameList.MathFormulaCard);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    this.baseRoom.setMaxClient(this.game.maxPlayers as number);
    this.setState(new MathFormulaCardState());
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
    this.dispatcher.dispatch(new ResetCommand());
  }
}