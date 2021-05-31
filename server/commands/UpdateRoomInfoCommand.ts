import { Command } from '@colyseus/command';
import { GameList } from 'models/Game';
import { TicTacToe } from '../tictactoe/TicTacToeState';

export type Payload = {
  maxPlayers?: number;
  roomTitle?: string;
  gamePack?: GameList;
};

export default class UpdateRoomInfoCommand extends Command<TicTacToe> {
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
