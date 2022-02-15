import { useEffect } from 'react';
import kaboom from 'kaboom';

export default function GameBoy() {
  useEffect(() => {
    initKaboom();
  }, []);

  const initKaboom = () => {
    let curDraggin: any = null;
    const canvas = document.getElementById('game-boy') as HTMLCanvasElement;
    kaboom({
      canvas,
      background: [255, 255, 255],
    });

    function drag() {
      // the difference between object pos and mouse pos
      let offset = vec2(0);

      return {
        // name of the component
        id: 'drag',
        // it requires the "pos" and "area" component
        require: ['pos', 'area'],
        // "add" is a lifecycle method gets called when the obj is added to scene
        add() {
          // TODO: these need to be checked in reverse order
          // "this" in all methods refer to the obj
          this.clicks(() => {
            if (curDraggin) {
              return;
            }
            curDraggin = this;
            offset = mousePos().sub(this.pos);
            readd(this);
          });
        },
        // "update" is a lifecycle method gets called every frame the obj is in scene
        update() {
          if (curDraggin === this) {
            cursor('move');
            this.pos = mousePos().sub(offset);
          }
        },
      };
    }

    // drop
    mouseRelease(() => {
      curDraggin = null;
    });

    loadSprite('game-boy', 'gameboy-origin.png');
    loadSprite('card', 'card.png');
    add([sprite('game-boy'), scale(8)]);
    add([sprite('card'), scale(8), pos(900, 40), area(), drag()]);

    action(() => cursor('default'));
  };

  return <canvas id="game-boy" />;
}
