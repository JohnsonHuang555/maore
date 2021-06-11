import { Command } from '@colyseus/command';
import { GameList } from 'models/Game';
import type RoomState from '../state/RoomState';

export type Payload = {
  maxPlayers?: number;
  roomTitle?: string;
  gamePack?: GameList;
};

export default class UpdateRoomInfoCommand extends Command<RoomState> {
  execute(data: Payload) {
    // TODO: Refactor ??
    const { maxPlayers, roomTitle, gamePack } = data;
    if (roomTitle) {
      this.room.state.roomInfo.roomTitle = roomTitle;
    }
    if (maxPlayers) {
      this.room.state.roomInfo.maxPlayers = maxPlayers;
    }
    if (gamePack) {
      this.room.state.roomInfo.gamePack = gamePack;
    }
  }
}
