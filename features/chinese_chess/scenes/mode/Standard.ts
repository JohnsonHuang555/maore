import { GameSceneData } from 'features/chinese_chess/models/ChineseChessScene';
import Phaser from 'phaser';
import YesOrNoModal from 'features/base/ui/YesOrNoModal';
import Server from 'features/chinese_chess/ChineseChessServer';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import {
  Cell,
  Chess,
  GAME_PADDING,
} from 'features/chinese_chess/models/ChineseChessUI';
import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { CellComponent } from 'features/chinese_chess/components/CellComponent';
import { ChessComponent } from 'features/chinese_chess/components/ChessComponent';
import InfoModal from 'features/base/ui/InfoModal';
import { ChessSide } from 'features/chinese_chess/models/ChineseChessSide';

const MAX_PLAYERS = 2;
export default class Standard extends Phaser.Scene {
  private server!: Server;
  private initialChessesDictionary: { [key: string]: ChessInfo | undefined } =
    {};
  private prevSelectedChessId?: number;
  // 遊戲開始
  private isGameStart: boolean = false;
  private onGameOver!: () => void;

  // UI
  rexUI!: RexUIPlugin;
  private cells: Cell[] = [];
  private chesses: Chess[] = [];
  private surrenderDialog?: Dialog;
  private gameOverDialog?: Dialog;
  private yourTurnText?: Phaser.GameObjects.Text;

  constructor() {
    super('standard');
  }

  preload() {
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: RexUIPlugin,
      sceneKey: 'rexUI',
    });
    this.load.image('background', '/chinese_chess/background.jpeg');
    this.load.image('map', '/chinese_chess/map/standard_mode.png');
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
      this.server.updatePlayerGroup();
    }

    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'background');
    this.add.image(width / 2, height / 2, 'map').setScale(0.55);
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

    this.server.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    this.server.onPlayerGroupChanged(this.handlePlayerGroupChanged, this);
    this.server.onPlayerWon(this.handlePlayerWon, this);
  }

  // FPS 60
  update(_t: number, dt: number) {
    this.server.components.update(dt);
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const size = 55;
    const offsetX = 265;
    const offsetY = 300;
    let drawX = width * 0.5 - offsetX;
    let drawY = height * 0.5 - offsetY;
    if (this.server.playerInfo.group === ChessSide.Black) {
      for (let y = 9; y >= 0; y--) {
        for (let x = 8; x >= 0; x--) {
          this.createBoardItem(drawX, drawY, size, x, y);
          drawX += size + 11;
        }
        drawX = width * 0.5 - offsetX;
        drawY += size + 12;
      }
    } else {
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
          this.createBoardItem(drawX, drawY, size, x, y);
          drawX += size + 11;
        }
        drawX = width * 0.5 - offsetX;
        drawY += size + 12;
      }
    }
  };

  private createBoardItem(
    drawX: number,
    drawY: number,
    size: number,
    x: number,
    y: number
  ) {
    const chessInfo = this.initialChessesDictionary[`${x},${y}`];
    // 格子
    const cell = this.add.rectangle(drawX, drawY, size, size, 0xffffff, 0);

    this.cells.push({
      x,
      y,
      rectangle: cell,
    });

    this.server.components.addComponent(
      cell,
      new CellComponent(this.server, x, y)
    );

    if (chessInfo) {
      // 棋子
      const chess = this.add
        .sprite(cell.x, cell.y, 'chess', `${chessInfo.name}.png`)
        .setDisplaySize(size, size)
        .setDepth(1);

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
          this.handleSelectChess,
          this.handleEatChess,
          this.handleMoveChess
        )
      );
    }
  }

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

  // 清除選取 UI
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
      this.yourTurnText = this.add
        .text(GAME_PADDING, GAME_PADDING, '你的回合', {
          fontSize: '30px',
          padding: {
            top: 5,
          },
        })
        .setOrigin(0, 0);
    }
  }

  // 組別更新並顯示
  private handlePlayerGroupChanged(groupCount: number) {
    if (!this.isGameStart && groupCount === MAX_PLAYERS) {
      this.isGameStart = true;
      // 因為要知道組別決定如何劃出棋盤
      this.createBoard();

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
