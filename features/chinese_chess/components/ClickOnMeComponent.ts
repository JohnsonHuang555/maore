import Phaser from 'phaser';

import { IComponent } from 'features/base/services/ComponentService';

export class ClickOnMeComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    console.log('awake');
  }

  start() {
    console.log('start');
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
    console.log(`clicked on ${this.gameObject.name}`);
  }
}
