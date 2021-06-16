import { Command } from '@colyseus/command';
import { GameList } from 'models/Game';
import RoomState from '../state/RoomState';

export type Payload = {
  maxPlayers?: number;
  roomTitle?: string;
  gamePack?: GameList;
  gameMode?: string;
};

export default class UpdateRoomInfoCommand extends Command<RoomState> {
  execute(data: Payload) {
    // TODO: Refactor ??
    const { maxPlayers, roomTitle, gamePack, gameMode } = data;
    if (roomTitle) {
      this.room.state.roomInfo.roomTitle = roomTitle;
    }
    if (maxPlayers) {
      this.room.state.roomInfo.maxPlayers = maxPlayers;
    }
    if (gamePack) {
      this.room.state.roomInfo.gamePack = gamePack;
    }
    if (gameMode) {
      this.room.state.roomInfo.gameMode = gameMode;
    }
  }
}
