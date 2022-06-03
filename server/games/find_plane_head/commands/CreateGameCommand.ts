import { Command } from '@colyseus/command';
import { ArraySchema } from '@colyseus/schema';
import Random from '../../../utils/Random';
import short from 'short-uuid';
import FindPlaneHead from '../FindPlaneHead';
import BoardCellState from '../state/BoardCellState';

export enum PlaneDirection {
  Up,
  Down,
  Left,
  Right,
}

export enum PlaneType {
  //     O
  //     O
  //   OOOOO
  //     O
  //    O O
  Standard,
  //     O
  //    OOO
  //   O O O
  //     O
  //    OOO
  Jet,
  //     O
  //   OOOOO
  //     O
  //    OOO
  Traditional,
}

export default class CreateGameCommand extends Command<FindPlaneHead> {
  execute() {
    // 單機玩家
    if (this.room.clients.length === 1) {
    } else {
      // 兩組玩家 PK
    }
  }

  private createSinglePlayerBoard() {
    const board = new ArraySchema<BoardCellState>();
    // 隨機取三個位置當機頭
    const randomLocation = Random.getRangeNumbers(0, 99, 3);
    // 隨機決定飛機方向
    const randomDirection = Random.getRandomValuesByArray(
      [
        PlaneDirection.Up,
        PlaneDirection.Down,
        PlaneDirection.Left,
        PlaneDirection.Right,
      ],
      1
    );
    const planeList = [
      PlaneType.Standard,
      PlaneType.Jet,
      PlaneType.Traditional,
    ];
  }
}
