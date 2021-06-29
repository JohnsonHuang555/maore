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
import CreateGameCommand from './commands/CreateGameCommand';
import ResetCommand from './commands/ResetCommand';
import EatChessCommand from './commands/EatChessCommand';
import MoveChessCommand from './commands/MoveChessCommand';

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
    this.setState(new ChineseChessState());

    this.onMessage(ChineseChessMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand(), {
        mode: option.gameMode as GameMode,
      });
    });

    this.onMessage(
      ChineseChessMessage.FlipChess,
      (_c, message: { id: number }) => {
        this.dispatcher.dispatch(new FlipChessCommand(), {
          id: message.id,
        });
      }
    );

    this.onMessage(
      ChineseChessMessage.EatChess,
      (_c, message: { id: number; targetId: number }) => {
        this.dispatcher.dispatch(new EatChessCommand(), {
          id: message.id,
          targetId: message.targetId,
        });
      }
    );

    this.onMessage(
      ChineseChessMessage.MoveChess,
      (_c, message: { id: number; targetX: number; targetY: number }) => {
        this.dispatcher.dispatch(new MoveChessCommand(), {
          id: message.id,
          targetX: message.targetX,
          targetY: message.targetY,
        });
      }
    );
  }

  onJoin(client: Client, option: Metadata) {
    this.baseRoom.onJoin(client, option);
  }

  onLeave(client: Client) {
    this.baseRoom.onLeave(client);
    this.dispatcher.dispatch(new ResetCommand());
  }
}
