import { Command } from '@colyseus/command';
import { GameMode } from '../../../../features/chinese_chess/models/Mode';
import ChineseChessState from '../state/ChineseChessState';
import {
  ChessNameRed,
  ChessNameBlack,
  ChessSide,
} from '../../../../features/chinese_chess/models/Chess';
import { ArraySchema } from '@colyseus/schema';
import { ChessInfoState } from '../state/ChessInfoState';
import Random from '../../../utils/Random';
import { ChessHiddenMap } from '../state/ChessHiddenMap';

type Payload = {
  mode: GameMode;
};

export default class CreateGameCommand extends Command<ChineseChessState> {
  execute(data: Payload) {
    const { mode } = data;
    if (this.room.state.chineseChesses.length) {
      return;
    }
    switch (mode) {
      case GameMode.Standard: {
        const chineseChesses = this.createStandard();
        this.room.state.chineseChesses = chineseChesses;
        break;
      }
      case GameMode.Hidden: {
        const chineseChesses = this.createHidden();
        this.room.state.chineseChesses = chineseChesses;
        break;
      }
    }
  }

  private createStandard(): ArraySchema<ChessInfoState> {
    const allChessesOnBoard = [
      [
        ChessNameBlack.Chariot,
        ChessNameBlack.Horse,
        ChessNameBlack.Minister,
        ChessNameBlack.Guard,
        ChessNameBlack.King,
        ChessNameBlack.Guard,
        ChessNameBlack.Minister,
        ChessNameBlack.Horse,
        ChessNameBlack.Chariot,
      ],
      [
        '',
        ChessNameBlack.Cannon,
        '',
        '',
        '',
        '',
        '',
        ChessNameBlack.Cannon,
        '',
      ],
      [
        ChessNameBlack.Soldier,
        '',
        ChessNameBlack.Soldier,
        '',
        ChessNameBlack.Soldier,
        '',
        ChessNameBlack.Soldier,
        '',
        ChessNameBlack.Soldier,
      ],
      [
        ChessNameRed.Soldier,
        '',
        ChessNameRed.Soldier,
        '',
        ChessNameRed.Soldier,
        '',
        ChessNameRed.Soldier,
        '',
        ChessNameRed.Soldier,
      ],
      ['', ChessNameRed.Cannon, '', '', '', '', '', ChessNameRed.Cannon, ''],
      [
        ChessNameRed.Chariot,
        ChessNameRed.Horse,
        ChessNameRed.Minister,
        ChessNameRed.Guard,
        ChessNameRed.King,
        ChessNameRed.Guard,
        ChessNameRed.Minister,
        ChessNameRed.Horse,
        ChessNameRed.Chariot,
      ],
    ];
    const chesses = new ArraySchema<ChessInfoState>();
    let id = 1;
    let currentIndex = 0;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        const currentLine = allChessesOnBoard[currentIndex];
        // 為空字串的話跳過此次迴圈
        if (!currentLine[x]) {
          continue;
        }
        // 要放棋子的行數
        switch (y) {
          case 0:
          case 2:
          case 3: {
            chesses.push(
              new ChessInfoState({
                id,
                chessSide: ChessSide.Black,
                name: currentLine[x] as ChessNameBlack,
                locationX: x,
                locationY: y,
                alive: true,
              })
            );
            break;
          }
          case 6:
          case 7:
          case 9: {
            chesses.push(
              new ChessInfoState({
                id,
                chessSide: ChessSide.Red,
                name: currentLine[x] as ChessNameRed,
                locationX: x,
                locationY: y,
                alive: true,
              })
            );
            break;
          }
        }
      }
      currentIndex++;
    }
    return chesses;
  }

  private createHidden(): ArraySchema<ChessInfoState> {
    const chesses = new ArraySchema<ChessInfoState>();
    const randomLocation = Random.getShuffleNumbers(0, 31);
    for (let i = 0; i < 32; i++) {
      const x = randomLocation[i] % 8;
      const y = Math.floor(randomLocation[i] / 8);
      chesses.push(
        new ChessInfoState({
          id: ChessHiddenMap[i].id,
          chessSide: ChessHiddenMap[i].side,
          name: ChessHiddenMap[i].name,
          rank: ChessHiddenMap[i].rank,
          isFlipped: false,
          alive: true,
          locationX: x,
          locationY: y,
        })
      );
    }
    return chesses;
  }
}
