import Phaser from 'phaser';
import { IComponent } from 'features/base/services/ComponentService';
import ChineseChessServer from '../ChineseChessServer';

export class FlipChessComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  private server: ChineseChessServer;
  private id: number;
  private x: number;
  private y: number;
  private isFlipped: boolean = false;
  private onFlip: (component: FlipChessComponent) => void;
  private onSelect: (component: FlipChessComponent) => void;

  constructor(
    server: ChineseChessServer,
    id: number,
    x: number,
    y: number,
    onFlip: (component: FlipChessComponent) => void,
    onSelect: (component: FlipChessComponent) => void
  ) {
    this.server = server;
    this.id = id;
    this.x = x;
    this.y = y;
    this.onFlip = onFlip;
    this.onSelect = onSelect;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    this.gameObject
      .setInteractive()
      .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
        this.handleClickChess,
        this
      );
  }

  update() {
    const changedChessInfo = this.server.changedChessInfo;
    if (changedChessInfo && changedChessInfo.chessInfo.id === this.id) {
      this.isFlipped = true;
      this.server.clearChangedChessInfo();
      this.onFlip(this);
    }
  }

  destroy() {
    this.gameObject.off(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.handleClickChess,
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

  private handleClickChess() {
    if (this.server.isYourTurn) {
      if (!this.isFlipped) {
        this.server.flipChess(this.id);
      } else {
        // select chess
        this.onSelect(this);
      }
    }
  }
}
