import { Command } from '@colyseus/command';
import { GameList } from '../../../../models/Game';
import RoomState from '../state/RoomState';

export type Payload = {
  maxPlayers: number;
  roomTitle: string;
  gamePack: GameList | '';
  gameMode?: string;
};

export default class UpdateRoomInfoCommand extends Command<RoomState> {
  execute(data: Payload) {
    const { maxPlayers, roomTitle, gamePack, gameMode } = data;
    this.room.state.roomInfo.roomTitle = roomTitle;
    this.room.state.roomInfo.maxPlayers = maxPlayers;
    this.room.state.roomInfo.gamePack = gamePack;
    if (gameMode) {
      this.room.state.roomInfo.gameMode = gameMode;
    }
  }
}
