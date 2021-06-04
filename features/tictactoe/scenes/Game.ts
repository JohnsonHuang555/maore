import { GameOverSceneData, GameSceneData } from 'models/Scenes';
import Phaser from 'phaser';
import { Cell } from '../models/Cell';
import Server from '../Server';

export default class Game extends Phaser.Scene {
  private server?: Server;
  private onGameOver?: (data: GameOverSceneData) => void;

  private cells: { display: Phaser.GameObjects.Rectangle; value: Cell }[] = [];

  constructor() {
    super('game');
  }

  init() {
    this.cells = [];
  }

  create(data: GameSceneData) {
    const { server, onGameOver } = data;
    this.server = server;
    this.onGameOver = onGameOver;

    if (!this.server) {
      throw new Error('server instance missing');
    }

    this.createBoard();
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const size = 128;
    const board: Cell[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    let x = width * 0.5 - size;
    let y = height * 0.5 - size;
    board.forEach((cellState, idx) => {
      const cell = this.add
        .rectangle(x, y, size, size, 0xffffff)
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          this.server?.makeSelection(idx);
        });

      switch (cellState) {
        case Cell.X: {
          this.add.star(cell.x, cell.y, 4, 4, 60, 0xff0000).setAngle(45);
          break;
        }
        case Cell.O: {
          this.add.circle(cell.x, cell.y, 50, 0x0000ff);
        }
      }

      this.cells.push({
        display: cell,
        value: cellState,
      });

      x += size + 5;

      if ((idx + 1) % 3 === 0) {
        y += size + 5;
        x = width * 0.5 - size;
      }
    });

    // this.server?.onBoardChanged(this.handleBoardChanged, this);
    // this.server?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    // this.server?.onPlayerWon(this.handlePlayerWon, this);
    // this.server?.onGameStateChanged(this.handleGameStateChanged, this);
  };
}
