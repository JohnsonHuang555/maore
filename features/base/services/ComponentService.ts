import Phaser from 'phaser';
import short from 'short-uuid';

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export interface IComponent {
  init(go: Phaser.GameObjects.GameObject): void;

  awake?: () => void;
  start?: () => void;
  update?: (dt: number) => void;

  destroy: () => void;
}

export default class ComponentService {
  private componentsByGameObject = new Map<string, IComponent[]>();
  private queuedForStart: IComponent[] = [];

  addComponent(go: Phaser.GameObjects.GameObject, component: IComponent) {
    // TODO: give our gameObjects a unique name
    if (!go.name) {
      go.name = short.generate();
    }

    // TODO: make sure there is a list of components for this gameObject
    if (!this.componentsByGameObject.has(go.name)) {
      this.componentsByGameObject.set(go.name, []);
    }

    // TODO: add new component to this gameObject's list
    const list = this.componentsByGameObject.get(go.name) as IComponent[];
    list.push(component);

    // TODO: call the lifecycle hooks
    component.init(go);

    if (component.awake) {
      component.awake();
    }

    if (component.start) {
      this.queuedForStart.push(component);
    }
  }

  findComponent<ComponentType>(
    go: Phaser.GameObjects.GameObject,
    componentType: Constructor<ComponentType>
  ) {
    // TODO: find component of type for this gameObject
    const components = this.componentsByGameObject.get(go.name);
    if (!components) {
      return null;
    }

    return components.find((component) => components instanceof componentType);
  }

  destroy() {
    // TODO: clean up all components
    const entries = this.componentsByGameObject.entries();
    for (const [, components] of entries) {
      components.forEach((component) => {
        if (component.destroy) {
          component.destroy();
        }
      });
    }
  }

  update(dt: number) {
    // TODO: process queued for start
    while (this.queuedForStart.length > 0) {
      const component = this.queuedForStart.shift();
      if (component?.start) {
        component.start();
      }
    }

    // TODO: update each component on each gameObject
    const entries = this.componentsByGameObject.entries();
    for (const [, components] of entries) {
      components.forEach((component) => {
        if (component.update) {
          component.update(dt);
        }
      });
    }
  }
}
