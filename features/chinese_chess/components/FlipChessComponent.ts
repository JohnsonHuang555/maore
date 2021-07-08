import Phaser from 'phaser';

import { IComponent } from 'features/base/services/ComponentService';

export class FlipChessComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  private x: number;
  private y: number;
  private onFlip: (component: FlipChessComponent) => void;

  constructor(
    x: number,
    y: number,
    onFlip: (component: FlipChessComponent) => void
  ) {
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
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleClick, this);
  }

  destroy() {
    this.gameObject.off(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.handleClick,
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

  private handleClick() {
    this.onFlip(this);
  }
}
