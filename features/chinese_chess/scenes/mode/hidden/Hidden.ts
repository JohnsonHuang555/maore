import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import {
  GameSceneData,
  PlayerGroup,
} from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import {
  ChineseChessGroup,
  ChineseChessGroupMap,
} from 'features/chinese_chess/models/ChineseChessGroup';
import { sharedInstance as events } from 'features/base/EventCenter';
import ComponentService from 'features/base/services/ComponentService';
import { FlipChessComponent } from 'features/chinese_chess/components/FlipChessComponent';

const MAX_PLAYERS = 2;
const GroupText: any = {
  [ChineseChessGroup.Black]: '黑方',
  [ChineseChessGroup.Red]: '紅方',
};

export default class Hidden extends Phaser.Scene {
  private components!: ComponentService;
  private server!: Server;
  private onGameOver!: (data: GameOverSceneData) => void;
  private selectedChessUI?: Phaser.GameObjects.Arc;
  private yourGroupText?: Phaser.GameObjects.Text;
  private otherGroupText?: Phaser.GameObjects.Text;
  private yourTurnText?: Phaser.GameObjects.Text;
  private chessesDictionary: { [key: string]: ChessInfo } = {};
  private chesses: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('hidden');
  }

  init() {
    // create components service
    this.components = new ComponentService();

    // TODO: clean up components on scene shutdown
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.components.destroy();
    });
  }

  preload() {
    this.load.image('map', '/chinese_chess/map/hidden_mode.png');
    this.load.atlas(
      'chess',
      '/chinese_chess/chesses.png',
      '/chinese_chess/chesses.json'
    );
  }

  create(data: GameSceneData) {
    const { server, chineseChesses, onGameOver } = data;
    this.server = server;
    this.onGameOver = onGameOver;

    if (!this.server) {
      throw new Error('server instance missing');
    }

    // FIXME: 有沒有更好的做法
    this.server.clearChangedChessInfo();

    // 在開始遊戲時，決定遊玩順序，由房主決定
    if (this.server.playerInfo.isMaster) {
      this.server.createPlayerOrder();
    }

    const { width, height } = this.scale;
    const map = this.add.image(width * 0.5, height * 0.5, 'map');
    map.setScale(0.75);
    chineseChesses.forEach((chess) => {
      this.chessesDictionary[`${chess.locationX},${chess.locationY}`] = chess;
    });

    this.createBoard();

    // events.on('select-chess', this.handleSelectChess, this);
    // events.on('clear-selected-chess-ui', this.handleClearSelectedChessUI, this);
  }

  update(t: number, dt: number) {
    // TODO: update components
    this.components.update(dt);
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const offsetX = 548;
    const offsetY = 235;
    const size = 128;
    let drawX = width * 0.5 - offsetX;
    let drawY = height * 0.5 - offsetY;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff, 0)
          .setInteractive();

        const chess = this.add
          .sprite(cell.x, cell.y, 'chess', 'hidden.png')
          .setDisplaySize(120, 120);

        this.chesses.push(chess);
        const chessInfo = this.chessesDictionary[`${x},${y}`];

        // TODO: add a component to the chess
        this.components.addComponent(
          chess,
          new FlipChessComponent(
            this.server,
            chessInfo,
            x,
            y,
            this.handleFlipChess,
            this.handleSelectChess
          )
        );

        drawX += size + 28;
      }
      drawY += size + 28;
      drawX = width * 0.5 - offsetX;
    }

    this.server.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    this.server.onPlayerGroupChanged(this.handlePlayerGroupChanged, this);
  };

  private getAt(x: number, y: number) {
    const index = y * 8 + x;
    return {
      chess: this.chesses[index],
      index,
    };
  }

  private handleFlipChess = (component: FlipChessComponent) => {
    const { x, y } = component.getLocation();
    const { name } = this.chessesDictionary[`${x},${y}`];
    const selected = this.getAt(x, y);
    const timeline = this.tweens.timeline({
      onComplete: () => {
        timeline.destroy();
      },
    });

    timeline.add({
      targets: selected.chess,
      scale: 0,
      duration: 100,
      onComplete: () => {
        selected.chess.setTexture('chess', `${name}.png`);
      },
    });

    timeline.add({
      targets: selected.chess,
      scale: 0.34,
      duration: 100,
    });

    timeline.play();
  };

  private handleSelectChess = (component: FlipChessComponent) => {
    const { x, y } = component.getLocation();
    const selected = this.getAt(x, y);

    const primaryColor = Phaser.Display.Color.ValueToColor(0xe0978b);
    const secondColor = Phaser.Display.Color.ValueToColor(0xeeeeee);

    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          primaryColor,
          secondColor,
          100,
          value
        );

        const color = Phaser.Display.Color.GetColor(
          colorObject.r,
          colorObject.g,
          colorObject.b
        );
        selected.chess.setTint(color);
      },
    });
  };

  private handlePlayerTurnChanged(playerIndex: number) {
    this.yourTurnText?.destroy();
    this.yourTurnText = undefined;
    if (this.server.playerInfo.playerIndex === playerIndex) {
      const { width } = this.scale;
      this.yourTurnText = this.add.text(width * 0.5, 50, '你的回合', {
        fontSize: '30px',
        align: 'center',
        padding: {
          top: 5,
        },
      });
    }
  }

  // 組別更新並顯示
  private handlePlayerGroupChanged(groups: PlayerGroup[]) {
    if (
      groups.length === MAX_PLAYERS &&
      !this.yourGroupText &&
      !this.otherGroupText
    ) {
      const { width } = this.scale;
      const player1 = groups[0];
      const player2 = groups[1];
      this.otherGroupText = this.add.text(
        width * 0.3,
        50,
        `${player1.playerName}：${GroupText[player1.group]}`,
        {
          padding: {
            top: 5,
          },
          fontSize: '24px',
        }
      );
      this.otherGroupText = this.add.text(
        width * 0.7,
        50,
        `${player2.playerName}：${GroupText[player2.group]}`,
        {
          padding: {
            top: 5,
          },
          fontSize: '24px',
        }
      );
    }
  }
}
