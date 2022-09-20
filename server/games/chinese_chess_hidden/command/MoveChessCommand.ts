import { Client } from 'colyseus';
import { Command } from '@colyseus/command';
import ChineseChessHidden from '../ChineseChessHidden';
import NextTurnCommand from '../../../room/commands/NextTurnCommand';
import { CheckMoveRange } from '../helpers/CheckMoveRange';
import { ChineseChessMessage } from '../../../../features/chinese_chess_hidden/models/ChineseChessMessage';
import {
  ChessNameRed,
  ChessNameBlack,
} from '../../../../features/chinese_chess_hidden/models/ChineseChessName';

type Payload = {
  client: Client;
  selectedChessId: string;
  targetX: number;
  targetY: number;
};

export default class MoveChessCommand extends Command<ChineseChessHidden> {
  execute(data: Payload) {
    const { client, selectedChessId, targetX, targetY } = data;
    const selectedChessIndex =
      this.room.state.chineseChessHidden.chesses.findIndex(
        (c) => c.id === selectedChessId
      );

    const selectedChess =
      this.room.state.chineseChessHidden.chesses[selectedChessIndex];

    const range = CheckMoveRange.shortCross(
      selectedChess.locationX,
      selectedChess.locationY
    );
    const isInRange = CheckMoveRange.isInRange(range, targetX, targetY);

    if (
      !isInRange &&
      (selectedChess.name === ChessNameBlack.Cannon ||
        selectedChess.name === ChessNameRed.Cannon)
    ) {
      client.send(ChineseChessMessage.ErrorMsg, '超出範圍!!');
      return;
    }

    selectedChess.locationX = targetX;
    selectedChess.locationY = targetY;
    return [new NextTurnCommand()];
  }
}
