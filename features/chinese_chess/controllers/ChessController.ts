import Phaser from 'phaser';
import StateMachine from 'statemachines/StateMachine';
import { ChessInfo } from '../models/ChineseChessState';

enum StateName {
  Idle = 'idle',
  Hidden = 'hidden',
  Selected = 'selected',
}

export default class ChessController {
  private scene: Phaser.Scene;
  private chessInfo: ChessInfo;
  private stateMachine: StateMachine;
  private drawX: number;
  private drawY: number;
  private cellSize: number;

  constructor(
    scene: Phaser.Scene,
    chessInfo: ChessInfo,
    drawX: number,
    drawY: number,
    cellSize: number
  ) {
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
      .addState('chess', {
        onEnter: this.chessOnEnter,
      })
      .setState('cell');
  }

  update(dt: number) {
    this.stateMachine.update(dt);
  }

  private cellOnEnter() {
    this.stateMachine.setState('chess');
    const cell = this.scene.add
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

  private chessOnEnter() {
    const chessImage = this.scene.add
      .image(this.drawX, this.drawY, 'chess', 'hidden.png')
      .setDisplaySize(120, 120)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        // this.server.flipChess(id);
      });
  }
}
