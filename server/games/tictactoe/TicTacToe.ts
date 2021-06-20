import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { Metadata } from '../../../models/Room';
import TicTacToeState from './state/TicTacToeState';
import { Message } from '../../../models/messages/RoomMessage';
import PlayerSelectionCommand from './commands/PlayerSelectionCommand';
import ResetCommand from './commands/ResetCommand';
import BaseRoom from '../../room';
import GameUseCase from '../../usecases/GameUseCase';
import { Game, GameList } from '../../../models/Game';

export default class TicTacToe extends Room<TicTacToeState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);
  private game: Game = GameUseCase.getGameByGamePack(GameList.TicTacToe);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    this.baseRoom.setMaxClient(this.game.maxPlayers as number);
    this.setState(new TicTacToeState());

    // 監聽前端的選擇事件
    this.onMessage(
      Message.PlayerSelection,
      (client, message: { index: number }) => {
        this.dispatcher.dispatch(new PlayerSelectionCommand(), {
          client,
          index: message.index,
        });
      }
    );

    this.onMessage(Message.PlayAgain, () => {
      this.dispatcher.dispatch(new ResetCommand());
    });
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
  }
}