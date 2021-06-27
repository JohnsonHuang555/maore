import { GameOverSceneData } from 'models/Scenes';
import { GameSceneData } from 'features/chess/model/ChessScene';
import Phaser from 'phaser';
import { CellColor, ChessCell } from 'features/chess/model/ChessCell';
import Server from 'features/chess/ChessServer';
import { GameStatus } from 'models/Room';
import { ChessColumnName } from '../model/Chess';

export default class Game extends Phaser.Scene {
  private server!: Server;
  private onGameOver?: (data: GameOverSceneData) => void;

  // private cells: { display: Phaser.GameObjects.Rectangle; value: Cell }[] = [];

  constructor() {
    super('game');
  }

  init() {
    // this.cells = [];
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
    console.log(this.server.InitialChessInfo, 'InitialChessInfo');
    const { width, height } = this.scale;
    const size = width / 8; // 一格的大小
    const sixtyFourArray = Array.from(Array(64).keys());

    const emptyBoard: ChessCell[] = sixtyFourArray.map((_cell, index) => {
      const color = index % 2 === 0 ? CellColor.Black : CellColor.White;
      const x = index % 8;
      const y = Math.floor(index / 8);

      return {
        color,
        x,
        y,
      }
    });

    const initialBoard: ChessCell[] = emptyBoard.map((cell, index) => {
      // const side = 
      // if (cell.x === ) {

      // }
      return {
        ...cell,
      }
    });

    let x = width * 0.5 - size;
    let y = height * 0.5 - size;
    // board.forEach((cellState, idx) => {
    //   const cell = this.add
    //     .rectangle(x, y, size, size, 0xffffff)
    //     .setInteractive()
    //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
    //       this.server?.makeSelection(idx);
    //     });

    //   switch (cellState) {
    //     case Cell.X: {
    //       this.add.star(cell.x, cell.y, 4, 4, 60, 0xff0000).setAngle(45);
    //       break;
    //     }
    //     case Cell.O: {
    //       this.add.circle(cell.x, cell.y, 50, 0x0000ff);
    //     }
    //   }

    //   this.cells.push({
    //     display: cell,
    //     value: cellState,
    //   });

    //   x += size + 5;

    //   if ((idx + 1) % 3 === 0) {
    //     y += size + 5;
    //     x = width * 0.5 - size;
    //   }
    // });

    // this.server?.onBoardChanged(this.handleBoardChanged, this);
    // this.server?.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    // this.server?.onPlayerWon(this.handlePlayerWon, this);
  };

  private handleBoardChanged() {
    // const cell = this.cells[idx];
    // if (cell.value !== newValue) {
    //   switch (newValue) {
    //     case Cell.X: {
    //       this.add
    //         .star(cell.display.x, cell.display.y, 4, 4, 60, 0xff0000)
    //         .setAngle(45);
    //       break;
    //     }
    //     case Cell.O: {
    //       this.add.circle(cell.display.x, cell.display.y, 50, 0x0000ff);
    //     }
    //   }
    //   cell.value = newValue;
    // }
  }

  private handlePlayerTurnChanged(playerIndex: number) {
    // TODO: show a message letting the player know it is their turn
  }

  private handlePlayerWon(playerIndex: number) {
    // const gameState = this.server?.gameState;
    // this.time.delayedCall(1000, () => {
    //   if (!this.onGameOver) {
    //     return;
    //   }
    //   if (gameState === GameStatus.Finished) {
    //     return;
    //   }
    //   console.log('handle player win');
    //   this.onGameOver({ winner: this.server?.playerIndex === playerIndex });
    //   this.server?.resetGame();
    // });
  }
}
