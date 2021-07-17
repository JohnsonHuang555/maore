import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import {
  GameSceneData,
  PlayerGroup,
} from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessGroup } from 'features/chinese_chess/models/ChineseChessGroup';
import ComponentService from 'features/base/services/ComponentService';
import { ChessComponent } from 'features/chinese_chess/components/ChessComponent';
import { CellComponent } from 'features/chinese_chess/components/CellComponent';

const MAX_PLAYERS = 2;
const GroupText: { [key: string]: string } = {
  [ChineseChessGroup.Black]: '黑方',
  [ChineseChessGroup.Red]: '紅方',
};

type Cell = {
  x: number;
  y: number;
  rectangle: Phaser.GameObjects.Rectangle;
};

type Chess = {
  id: number;
  name: string;
  sprite: Phaser.GameObjects.Sprite;
};

export default class Hidden extends Phaser.Scene {
  private components!: ComponentService;
  private server!: Server;
  private onGameOver!: (data: GameOverSceneData) => void;
  private yourGroupText?: Phaser.GameObjects.Text;
  private otherGroupText?: Phaser.GameObjects.Text;
  private yourTurnText?: Phaser.GameObjects.Text;
  private initialChessesDictionary: { [key: string]: ChessInfo } = {};
  private prevSelectedChessId?: number;

  // UI
  private cells: Cell[] = [];
  private chesses: Chess[] = [];

  constructor() {
    super('hidden');
  }

  init() {
    this.components = new ComponentService();
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
      // TODO: 需要更新
      this.initialChessesDictionary[`${chess.locationX},${chess.locationY}`] =
        chess;
    });

    this.createBoard();
  }

  // FPS 60
  update(t: number, dt: number) {
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
        const chessInfo = this.initialChessesDictionary[`${x},${y}`];
        // 格子
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff)
          .setDisplaySize(120, 120);

        this.cells.push({
          x,
          y,
          rectangle: cell,
        });

        this.components.addComponent(
          cell,
          new CellComponent(this.server, x, y)
        );

        // 棋子
        const chess = this.add
          .sprite(cell.x, cell.y, 'chess', 'hidden.png')
          .setDisplaySize(120, 120)
          .setDepth(1);
        // .setSize(size, size);

        this.chesses.push({
          id: chessInfo.id,
          name: chessInfo.name,
          sprite: chess,
        });

        this.components.addComponent(
          chess,
          new ChessComponent(
            this.server,
            chessInfo,
            this.handleFlipChess,
            this.handleSelectChess,
            this.handleEatChess,
            this.handleMoveChess
          )
        );

        drawX += size + 28;
      }
      drawX = width * 0.5 - offsetX;
      drawY += size + 28;
    }

    this.server.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    this.server.onPlayerGroupChanged(this.handlePlayerGroupChanged, this);
  };

  private getCellByLocation(x: number, y: number): Cell {
    const cell = this.cells.find((c) => c.x === x && c.y === y);
    if (!cell) {
      throw new Error('Cell not found');
    }
    return cell;
  }

  private getChessById(id: number): { chess: Chess; index: number } {
    const chessIndex = this.chesses.findIndex((c) => c.id === id);
    if (chessIndex === -1) {
      throw new Error('Chess not found');
    }
    return {
      chess: this.chesses[chessIndex],
      index: chessIndex,
    };
  }

  private handleFlipChess = (id: number) => {
    // 清除之前選的
    this.clearSelectedChessUI();
    const { chess } = this.getChessById(id);
    const timeline = this.tweens.timeline({
      onComplete: () => {
        timeline.destroy();
      },
    });

    timeline.add({
      targets: chess.sprite,
      scale: 0,
      duration: 100,
      onComplete: () => {
        chess.sprite.setTexture('chess', `${chess.name}.png`);
      },
    });

    timeline.add({
      targets: chess.sprite,
      scale: 0.32,
      duration: 100,
    });

    timeline.play();
  };

  private handleSelectChess = (id: number) => {
    // 清除之前選的
    this.clearSelectedChessUI();
    const { chess } = this.getChessById(id);
    this.prevSelectedChessId = id;

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
        chess.sprite.setTint(color);
      },
    });
  };

  private handleEatChess = (id: number, targetId: number) => {
    this.clearSelectedChessUI();
    const { chess } = this.getChessById(id);
    const { chess: targetChess, index } = this.getChessById(targetId);
    this.tweens.add({
      targets: targetChess.sprite,
      scale: 0,
      duration: 100,
      onComplete: () => {
        targetChess.sprite.removeAllListeners();
        targetChess.sprite.destroy();
        this.chesses.splice(index, 1);
      },
    });
    this.tweens.add({
      targets: chess.sprite,
      x: targetChess.sprite.x,
      y: targetChess.sprite.y,
      duration: 300,
      ease: Phaser.Math.Easing.Back.Out,
    });
  };

  private handleMoveChess = (
    id: number,
    targetLocationX: number,
    targetLocationY: number
  ) => {
    console.log(targetLocationX, 'x');
    console.log(targetLocationY, 'y');
    this.clearSelectedChessUI();
    const { chess } = this.getChessById(id);
    const { rectangle } = this.getCellByLocation(
      targetLocationX,
      targetLocationY
    );
    this.tweens.add({
      targets: chess.sprite,
      x: rectangle.x,
      y: rectangle.y,
      duration: 300,
      ease: Phaser.Math.Easing.Back.Out,
    });
  };

  private clearSelectedChessUI() {
    this.tweens.killAll();

    if (!this.prevSelectedChessId) {
      return;
    }
    const { chess } = this.getChessById(this.prevSelectedChessId);
    chess.sprite.clearTint();
    this.prevSelectedChessId = undefined;
  }

  // 房間相關
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
