import { useEffect } from 'react';
import kaboom from 'kaboom';

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

export default function Kaboom() {
  useEffect(() => {
    initKaboom();
  }, []);

  const initKaboom = () => {
    const canvas = document.getElementById('aa') as HTMLCanvasElement;
    kaboom({
      canvas,
      background: [255, 255, 255],
    });

    // loadSprite('bg', '/chinese_chess/standard.png');
    loadSprite('bean', 'Dexter.png');
    createGameScene();
    createLostScene();
    go('game');
  };

  const createGameScene = () => {
    // loadBean('bean');

    scene('game', () => {
      // define gravity
      gravity(2400);

      // add([sprite('bg', { width: width(), height: height() })]);

      // add a game object to screen
      const player = add([
        // list of components
        sprite('bean'),
        pos(80, 40),
        area(),
        body(),
        scale(2),
      ]);

      // floor
      add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        origin('botleft'),
        area(),
        solid(),
        color(127, 200, 255),
      ]);

      function jump() {
        if (player.grounded()) {
          player.jump(JUMP_FORCE);
        }
      }

      // jump when user press space
      keyPress('space', jump);
      mouseClick(jump);

      function spawnTree() {
        // add tree obj
        add([
          rect(48, rand(32, 96)),
          area(),
          outline(4),
          pos(width(), height() - FLOOR_HEIGHT),
          origin('botleft'),
          color(255, 180, 255),
          move(LEFT, SPEED),
          'tree',
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(0.5, 1.5), spawnTree);
      }

      // start spawning trees
      spawnTree();

      // lose if player collides with any game obj with tag "tree"
      player.collides('tree', () => {
        // go to "lose" scene and pass the score
        go('lose', score);
        burp();
        addKaboom(player.pos);
      });

      // keep track of score
      let score = 0;

      const scoreLabel = add([text(score), pos(24, 24)]);

      // increment score every frame
      action(() => {
        score++;
        scoreLabel.text = score;
      });
    });
  };

  const createLostScene = () => {
    scene('lose', (score) => {
      // add([
      //   sprite('bean'),
      //   pos(width() / 2, height() / 2 - 80),
      //   scale(2),
      //   origin('center'),
      // ]);

      // display score
      add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        origin('center'),
      ]);

      // go back to game with space is pressed
      keyPress('space', () => go('game'));
      mouseClick(() => go('game'));
    });
  };

  return <canvas id="aa"></canvas>;
}
