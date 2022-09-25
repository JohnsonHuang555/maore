import { Command } from '@colyseus/command';
import RoomState from '../state/RoomState';
import { Metadata } from '../../../domain/models/Room';
import { Room } from 'colyseus';
import { GamePack } from 'server/domain/Game';

export type Payload = {
  maxPlayers: number;
  roomTitle: string;
  gamePack: GamePack | '';
};

export default class UpdateRoomInfoCommand extends Command<
  Room<RoomState, Metadata>
> {
  execute(data: Payload) {
    const { maxPlayers, roomTitle, gamePack } = data;
    this.room.state.roomInfo.roomTitle = roomTitle;
    this.room.state.roomInfo.maxPlayers = maxPlayers;
    this.room.state.roomInfo.gamePack = gamePack;
  }
}
