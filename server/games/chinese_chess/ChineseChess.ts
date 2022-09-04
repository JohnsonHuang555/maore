import { Client, Room } from 'colyseus';
import ChineseChessState from './state/ChineseChessState';
import { Dispatcher } from '@colyseus/command';
import BaseRoom from '../../room';
import { Metadata } from '../../../domain/models/Room';
import { GameMode } from '../../../features/chinese_chess/models/ChinesChessMode';
import { ChineseChessMessage } from '../../../features/chinese_chess/models/ChineseChessMessage';
import { ChineseChessGroup } from '../../../features/chinese_chess/models/ChineseChessGroup';
import { ChineseChessGroupMap } from '../../../features/chinese_chess/models/ChineseChessGroup';
import FlipChessCommand from './commands/FlipChessCommand';
import CreateGameCommand from './commands/CreateGameCommand';
import ResetCommand from './commands/ResetCommand';
import EatChessCommand from './commands/EatChessCommand';
import MoveChessCommand from './commands/MoveChessCommand';
import UpdatePlayerGroupCommand from '../../room/commands/UpdatePlayerGroupCommand';
import { RoomMessage } from '../../../domain/models/Message';
import CheckWinnerCommand from './commands/CheckWinnerCommand';
import SurrenderCommand from './commands/SurrenderCommand';
import RoomState from '../../room/state/RoomState';

export default class ChineseChess extends Room<RoomState, Metadata> {
  private dispatcher = new Dispatcher(this);
  private baseRoom = new BaseRoom(this);

  onCreate(option: Metadata) {
    this.baseRoom.onCreate(option);

    // max two players
    this.baseRoom.setMaxClient(2);
    this.setState(new RoomState());

    // 初始化遊戲
    this.onMessage(RoomMessage.CreateGame, () => {
      this.dispatcher.dispatch(new CreateGameCommand(), {
        mode: option.gameMode as GameMode,
      });
    });

    this.onMessage(
      ChineseChessMessage.FlipChess,
      (client, message: { id: number }) => {
        const chessIndex = this.state.chineseChess.chineseChesses.findIndex(
          (c) => c.id === message.id
        );
        this.dispatcher.dispatch(new FlipChessCommand(), {
          chessIndex,
        });
        const side =
          this.state.chineseChess.chineseChesses[chessIndex].chessSide;
        this.dispatcher.dispatch(new UpdatePlayerGroupCommand(), {
          allGroups: [ChineseChessGroup.Black, ChineseChessGroup.Red],
          needSetGroup: ChineseChessGroupMap[side],
          playerId: client.id,
        });
      }
    );

    this.onMessage(
      ChineseChessMessage.EatChess,
      (client, message: { id: number; targetId: number }) => {
        this.dispatcher.dispatch(new EatChessCommand(), {
          id: message.id,
          targetId: message.targetId,
        });
        const clientIndex = this.clients.findIndex((c) => c.id === client.id);
        const group = this.state.players[clientIndex].group;
        this.dispatcher.dispatch(new CheckWinnerCommand(), {
          gameMode: this.metadata.gameMode as GameMode,
          group,
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

    this.onMessage(ChineseChessMessage.Surrender, (client) => {
      this.dispatcher.dispatch(new SurrenderCommand(), {
        client,
      });
    });

    this.onMessage(ChineseChessMessage.UpdatePlayerGroupByStandardMode, () => {
      // 順位一的玩家為黑色
      const player = this.state.players.find((p) => p.playerOrder === 0);
      if (!player) {
        throw new Error('not found player...');
      }
      this.dispatcher.dispatch(new UpdatePlayerGroupCommand(), {
        allGroups: [ChineseChessGroup.Black, ChineseChessGroup.Red],
        needSetGroup: ChineseChessGroupMap[ChineseChessGroup.Black],
        playerId: player.id,
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
