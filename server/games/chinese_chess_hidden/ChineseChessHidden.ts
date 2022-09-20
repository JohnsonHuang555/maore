import { Client, Room } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { Metadata } from '@domain/models/Room';
import BaseRoom from '../../room';
import RoomState from '../../room/state/RoomState';
import ResetCommand from '../math_formula_card/commands/ResetCommand';
import { RoomMessage } from '../../../domain/models/Message';
import CreateGameCommand from './command/CreateGameCommand';
import { ChineseChessMessage } from '../../../features/chinese_chess_hidden/models/ChineseChessMessage';
import FlipChessCommand from './command/FlipChessCommand';
import EatChessCommand from './command/EatChessCommand';
import MoveChessCommand from './command/MoveChessCommand';

export default class ChineseChessHiddenState extends Room<RoomState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);

    // max two players
    this.baseRoom.setMaxClient(2);
    this.setState(new RoomState());

    // 初始化遊戲
    this.onMessage(RoomMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand());
    });

    this.onMessage(ChineseChessMessage.FlipChess, (client, id: string) => {
      const chessIndex = this.state.chineseChessHidden.chesses.findIndex(
        (c) => c.id === id
      );
      this.dispatcher.dispatch(new FlipChessCommand(), {
        client,
        chessIndex,
      });
    });

    this.onMessage(
      ChineseChessMessage.EatChess,
      (client, message: { selectedChessId: number; targetId: number }) => {
        this.dispatcher.dispatch(new EatChessCommand(), {
          client,
          selectedChessId: message.selectedChessId,
          targetId: message.targetId,
        });
      }
    );

    this.onMessage(
      ChineseChessMessage.MoveChess,
      (
        client,
        message: { selectedChessId: number; targetX: number; targetY: number }
      ) => {
        this.dispatcher.dispatch(new MoveChessCommand(), {
          client,
          selectedChessId: message.selectedChessId,
          targetX: message.targetX,
          targetY: message.targetY,
        });
      }
    );

    // 結束遊戲
    this.onMessage(RoomMessage.FinishGame, () => {
      this.dispatcher.dispatch(new ResetCommand());
      this.unlock();
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
