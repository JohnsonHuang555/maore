import { Client } from 'colyseus';
import { Command } from '@colyseus/command';
import ChineseChessHidden from '../ChineseChessHidden';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import { ChessSide } from '../../../../features/chinese_chess_hidden/models/ChineseChessSide';

type Payload = {
  client: Client;
  chessIndex: number;
};

export default class FlipChessCommand extends Command<ChineseChessHidden> {
  execute(data: Payload) {
    const { client, chessIndex } = data;
    this.room.state.chineseChessHidden.chesses[chessIndex].isFlipped = true;

    const playerInfo = this.room.state.chineseChessHidden.playerInfos.get(
      client.id
    );

    if (playerInfo && playerInfo.chessSide === '') {
      const chessSide =
        this.room.state.chineseChessHidden.chesses[chessIndex].chessSide;

      playerInfo.chessSide = chessSide;

      const otherPlayer = this.room.clients.find((c) => c.id !== client.id);
      if (otherPlayer) {
        const otherPlayerInfo =
          this.room.state.chineseChessHidden.playerInfos.get(otherPlayer.id);
        if (!otherPlayerInfo) {
          return;
        }
        if (chessSide === ChessSide.Black) {
          otherPlayerInfo.chessSide = ChessSide.Red;
        } else {
          otherPlayerInfo.chessSide = ChessSide.Black;
        }
      }
    }
    return [new NextTurnCommand()];
  }
}
