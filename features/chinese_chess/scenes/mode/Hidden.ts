import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameSceneData } from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChessComponent } from 'features/chinese_chess/components/ChessComponent';
import { CellComponent } from 'features/chinese_chess/components/CellComponent';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog';
import YesOrNoModal from 'features/base/ui/YesOrNoModal';
import InfoModal from 'features/base/ui/InfoModal';

const MAX_PLAYERS = 2;
type Cell = {
  x: number; // 資料的XY ex. x 0, y1
  y: number;
  rectangle: Phaser.GameObjects.Rectangle;
};

type Chess = {
  id: number;
  name: string;
  sprite: Phaser.GameObjects.Sprite; // image, circle, rectange, sprite
};
const GAME_PADDING = 20;

export default class Hidden extends Phaser.Scene {
  private server!: Server;
  private initialChessesDictionary: { [key: string]: ChessInfo } = {};
  private prevSelectedChessId?: number;
  private onGameOver!: () => void;

  // UI
  rexUI!: RexUIPlugin;
  private cells: Cell[] = [];
  private chesses: Chess[] = [];
  private surrenderDialog?: Dialog;
  private gameOverDialog?: Dialog;
  private yourTurnText?: Phaser.GameObjects.Text;

  constructor() {
    super('hidden');
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: RexUIPlugin,
      sceneKey: 'rexUI',
    });
    this.load.image('background', '/chinese_chess/background.jpeg');
    this.load.image('map', '/chinese_chess/map/hidden_mode.png');
    this.load.image('player', '/chinese_chess/player.png');
    this.load.image('black', '/chinese_chess/black_king.png');
    this.load.image('red', '/chinese_chess/red_king.png');
    this.load.image('surrender', '/chinese_chess/btn_surrender.png');
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

    // 初始化畫面
    const { width, height } = this.scale;
    this.add
      .image(width / 2, height / 2, 'background')
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        if (this.surrenderDialog && this.server.showSurrenderModal) {
          this.server.setShowSurrenderModal(false);
          this.surrenderDialog.destroy();
        }
      });
    this.add.image(width / 2, height / 2, 'map').setScale(0.5);
    this.add
      .image(width - GAME_PADDING, height - GAME_PADDING, 'surrender')
      .setScale(0.75)
      .setOrigin(1, 1)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        if (this.server.showSurrenderModal || this.server.isGameOver) {
          return;
        }
        this.surrenderDialog = YesOrNoModal({
          scene: this,
          description: '確定要投降嗎?',
        });
        this.surrenderDialog?.on(
          'button.click',
          (button: any) => {
            if (button.text === '是') {
              this.server.surrender();
            }
            this.server.setShowSurrenderModal(false);
            this.surrenderDialog?.destroy();
          },
          this
        );
        this.server.setShowSurrenderModal(true);
      });
    // 對手
    const opponentImage = this.add
      .image(width - GAME_PADDING, GAME_PADDING, 'player')
      .setScale(0.75)
      .setOrigin(1, 0);
    // 玩家
    const playerImage = this.add
      .image(GAME_PADDING, height - GAME_PADDING, 'player')
      .setScale(0.75)
      .setOrigin(0, 1);

    const nameStyle = {
      font: '20px Arial',
      fill: '#fff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    };

    this.server.allPlayers.forEach(({ id, name }) => {
      if (id === this.server.playerInfo.id) {
        const text = this.add.text(0, 0, name, nameStyle);
        Phaser.Display.Align.In.Center(
          text,
          this.add.zone(
            GAME_PADDING + 65,
            height - GAME_PADDING - 17,
            playerImage.width,
            playerImage.height
          )
        );
      } else {
        const text = this.add.text(0, 0, name, nameStyle);
        Phaser.Display.Align.In.Center(
          text,
          this.add.zone(
            width - GAME_PADDING - 63,
            GAME_PADDING + 125,
            opponentImage.width,
            opponentImage.height
          )
        );
      }
    });

    // 做字典以解決效能問題
    this.initialChessesDictionary = chineseChesses.reduce((prev, current) => {
      prev[`${current.locationX},${current.locationY}`] = current;
      return prev;
    }, {} as { [key: string]: ChessInfo });

    this.createBoard();
  }

  // FPS 60
  update(_t: number, dt: number) {
    this.server.components.update(dt);
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const offsetX = 365;
    const offsetY = 158;
    const size = 64;
    let drawX = width * 0.5 - offsetX;
    let drawY = height * 0.5 - offsetY;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const chessInfo = this.initialChessesDictionary[`${x},${y}`];
        // 格子
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff, 0)
          .setDisplaySize(100, 100);

        this.cells.push({
          x,
          y,
          rectangle: cell,
        });

        this.server.components.addComponent(
          cell,
          new CellComponent(this.server, x, y)
        );

        // 棋子
        const chess = this.add
          .sprite(cell.x, cell.y, 'chess', 'hidden.png')
          .setDisplaySize(100, 100)
          .setDepth(1);
        // .setSize(size, size);

        this.chesses.push({
          id: chessInfo.id,
          name: chessInfo.name,
          sprite: chess,
        });

        this.server.components.addComponent(
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

        drawX += size + 40;
      }
      drawX = width * 0.5 - offsetX;
      drawY += size + 40;
    }

    this.server.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    this.server.onPlayerGroupChanged(this.handlePlayerGroupChanged, this);
    this.server.onPlayerWon(this.handlePlayerWon, this);
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
      displayWidth: 100,
      displayHeight: 100,
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

  // 你的回合
  private handlePlayerTurnChanged(playerIndex: number) {
    this.yourTurnText?.destroy();
    this.yourTurnText = undefined;
    if (this.server.playerInfo.playerIndex === playerIndex) {
      const { width } = this.scale;
      this.yourTurnText = this.add
        .text(width * 0.5, 50, '你的回合', {
          fontSize: '30px',
          align: 'center',
          padding: {
            top: 5,
          },
        })
        .setOrigin(0.5, 0.5);
    }
  }

  // 組別更新並顯示
  private handlePlayerGroupChanged(groupCount: number) {
    if (groupCount === MAX_PLAYERS) {
      const { width, height } = this.scale;
      this.server.allPlayers.forEach(({ id, group }) => {
        if (id === this.server.playerInfo.id) {
          this.add
            .image(GAME_PADDING + 85, height - GAME_PADDING - 45, group)
            .setScale(0.75)
            .setOrigin(0, 1);
        } else {
          this.add
            .image(width - GAME_PADDING, GAME_PADDING + 55, group)
            .setScale(0.75)
            .setOrigin(1, 0);
        }
      });
    }
  }

  // 玩家勝出
  private handlePlayerWon(playerIndex: number) {
    if (playerIndex === -1) {
      return;
    }
    this.time.delayedCall(500, () => {
      if (!this.onGameOver) {
        return;
      }
      this.yourTurnText?.destroy();
      const isYouWin = this.server.playerInfo.playerIndex === playerIndex;
      this.gameOverDialog = InfoModal({
        scene: this,
        title: 'Game Over',
        description: isYouWin ? '你贏了' : '你輸了',
        noOKbutton: true,
      });

      this.gameOverDialog?.on(
        'button.click',
        () => {
          this.gameOverDialog?.destroy();
        },
        this
      );

      const { width } = this.scale;
      this.add
        .text(width / 2, 50, '按 ESC 關閉離開', {
          fontSize: '30px',
          align: 'center',
          padding: {
            top: 5,
          },
        })
        .setOrigin(0.5, 0.5);
      this.input.keyboard.once('keyup-ESC', () => {
        this.onGameOver();
      });
    });
  }
}
