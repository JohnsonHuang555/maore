import Phaser from 'phaser';

import { IComponent } from 'features/base/services/ComponentService';
import ChineseChessServer from '../ChineseChessServer';

export class FlipChessComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  private server: ChineseChessServer;
  private id: number;
  private x: number;
  private y: number;
  private onFlip: (component: FlipChessComponent) => void;

  constructor(
    server: ChineseChessServer,
    id: number,
    x: number,
    y: number,
    onFlip: (component: FlipChessComponent) => void
  ) {
    this.server = server;
    this.id = id;
    this.x = x;
    this.y = y;
    this.onFlip = onFlip;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    this.gameObject
      .setInteractive()
      .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
        this.handleFlipChess,
        this
      );
  }

  update() {
    const changedChessInfo = this.server.changedChessInfo;
    if (changedChessInfo && changedChessInfo.chessInfo.id === this.id) {
      this.server.clearChangedChessInfo();
      this.onFlip(this);
    }
  }

  destroy() {
    this.gameObject.off(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.handleFlipChess,
      this
    );
  }

  setLocation(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getLocation() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  private handleFlipChess() {
    if (this.server.isYourTurn) {
      // this.onFlip(this);
      this.server.flipChess(this.id);
    }
  }
}
