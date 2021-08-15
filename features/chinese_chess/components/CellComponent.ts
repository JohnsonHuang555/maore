import Phaser from 'phaser';
import { IComponent } from 'features/base/services/ComponentService';
import ChineseChessServer from '../ChineseChessServer';

export class CellComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;
  private server: ChineseChessServer;
  private x: number;
  private y: number;

  constructor(server: ChineseChessServer, x: number, y: number) {
    this.server = server;
    this.x = x;
    this.y = y;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    this.gameObject
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleClick, this);
  }

  destroy() {
    this.gameObject.off(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.handleClick,
      this
    );
  }

  private handleClick() {
    if (!this.server.isYourTurn) {
      return;
    }

    if (this.server.selectedChessId) {
      this.server.moveChess(this.x, this.y);
    }
  }
}
