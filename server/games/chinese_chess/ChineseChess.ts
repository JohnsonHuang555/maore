import { Client, Room } from 'colyseus';
import ChineseChessState from './state/ChineseChessState';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../../room';
import { Metadata } from '../../../models/Room';
import GameUseCase from '../../usecases/GameUseCase';
import { Game, GameList } from '../../../models/Game';
import { GameMode } from '../../../features/chinese_chess/models/Mode';
import { ChineseChessMessage } from '../../../models/messages/ChineseChessMessage';
import FlipChessCommand from './commands/FlipChessCommand';

export default class ChineseChess extends Room<ChineseChessState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);
  private game: Game = GameUseCase.getGameByGamePack(GameList.ChineseChess);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);
    if (!option.gameMode) {
      throw new Error('game mode not found');
    }

    const maxPlayers = this.game.modes?.find(
      (m) => m.value === option.gameMode
    )?.maxPlayers;
    this.baseRoom.setMaxClient(maxPlayers as number);
    this.setState(new ChineseChessState(option.gameMode as GameMode));

    this.onMessage(
      ChineseChessMessage.FlipChess,
      (client, message: { id: number }) => {
        this.dispatcher.dispatch(new FlipChessCommand(), {
          client,
          id: message.id,
        });
      }
    );
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
  }
}
