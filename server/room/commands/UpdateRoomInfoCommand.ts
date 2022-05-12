import { Command } from '@colyseus/command';
import { GameList } from '../../../domain/models/Game';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';

export type Payload = {
  maxPlayers: number;
  roomTitle: string;
  gamePack: GameList | '';
  gameMode?: string;
};

export default class UpdateRoomInfoCommand extends Command<
  Room<RoomState, Metadata>
> {
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
