import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import { ChessState } from '../ChessState';
import { Chess, Side, ChessName } from '../../../features/chess/model/Chess';
import ChessGameState from '../ChessGameState';

export type Payload = Chess;

export default class ChessInitialCommand extends Command<ChessGameState> {
  execute() {

    const initialArray = new Array(32);
    const initialData: ArraySchema<ChessState> = new ArraySchema<ChessState>();
    initialArray.forEach((_item, index) => {
      const id = index + 1;

      const x = (id % 8) - 1;
      let y = 0;
      let name = ChessName.Minion;

      if (index < 8) {
        y = 0;
      } else if (index > 7 || index < 16) {
        y = 1;
      } else if (index > 15 || index < 24) {
        y = 6;
      } else if (index > 23 || index < 32) {
        y = 7;
      }

      if (id === 1 || id === 8 ||  id === 25 ||  id === 32) {
        name = ChessName.Caslte;
      } else if (id === 2 || id === 7 ||  id === 26 ||  id === 31) {
        name = ChessName.Kight;
      } else if (id === 3 || id === 6 ||  id === 27 ||  id === 30) {
        name = ChessName.Bishop;
      } else if (id === 4 || id === 28) {
        name = ChessName.King;
      } else if (id === 5 || id === 29) {
        name = ChessName.Queen;
      } else if (id > 8 && id < 25) {
        name = ChessName.Minion;
      }

      const side = id < 17 ? Side.Black : Side.White;

      initialData.push(new ChessState({
        id,
        x,
        y,
        side,
        name,
      }));
    });

    this.room.state.chesses = initialData;
  }
}
