import Phaser from 'phaser';
import StateMachine from 'statemachines/StateMachine';
import { ChessInfo } from '../models/ChineseChessState';
import Server from 'features/chinese_chess/ChineseChessServer';

enum StateName {
  Idle = 'idle',
  Hidden = 'hidden',
  Selected = 'selected',
}

export default class ChessController {
  private server: Server;
  private scene: Phaser.Scene;
  private chessInfo: ChessInfo;
  private stateMachine: StateMachine;
  private drawX: number;
  private drawY: number;
  private cellSize: number;
  private changedChess?: Partial<ChessInfo>;
  private chessImage!: Phaser.GameObjects.Image;

  constructor(
    server: Server,
    scene: Phaser.Scene,
    chessInfo: ChessInfo,
    drawX: number,
    drawY: number,
    cellSize: number
  ) {
    this.server = server;
    this.scene = scene;
    this.chessInfo = chessInfo;
    this.stateMachine = new StateMachine(this, 'chineseChess');
    this.drawX = drawX;
    this.drawY = drawY;
    this.cellSize = cellSize;
    this.stateMachine
      .addState('cell', {
        onEnter: this.cellOnEnter,
      })
      .addState('chess-changed', {
        onEnter: this.chessChangedOnEnter,
        onUpdate: this.chessChangedOnUpdate,
      })
      .setState('cell');
  }

  update(dt: number, changedChess?: Partial<ChessInfo>) {
    this.stateMachine.update(dt);
    if (changedChess) {
      this.changedChess = changedChess;
    }
  }

  private cellOnEnter() {
    this.stateMachine.setState('chess-changed');
    this.scene.add
      .rectangle(
        this.drawX,
        this.drawY,
        this.cellSize,
        this.cellSize,
        0xffffff,
        0
      )
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        // if () {
        //   this.server.moveChess(id, x, y)
        // }
      });
  }

  private chessChangedOnEnter() {
    this.chessImage = this.scene.add
      .image(this.drawX, this.drawY, 'chess', 'hidden.png')
      .setDisplaySize(120, 120)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.server.flipChess(this.chessInfo.id);
      });
  }

  private chessChangedOnUpdate() {
    if (this.chessInfo.id === this.changedChess?.id) {
      this.chessImage.destroy();
    }
  }
}
