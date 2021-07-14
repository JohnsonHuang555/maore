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

const MAX_PLAYERS = 2;
const GroupText: { [key: string]: string } = {
  [ChineseChessGroup.Black]: '黑方',
  [ChineseChessGroup.Red]: '紅方',
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
  private chessesDictionary: { [key: string]: ChessInfo } = {};
  private chesses: Chess[] = [];
  private prevSelectedChessId?: number;

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
      this.chessesDictionary[`${chess.locationX},${chess.locationY}`] = chess;
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
        // 格子
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff, 0)
          .setInteractive();

        // 棋子
        const chessSprite = this.add
          .sprite(cell.x, cell.y, 'chess', 'hidden.png')
          .setDisplaySize(120, 120);
        // .setSize(size, size);

        const chessInfo = this.chessesDictionary[`${x},${y}`];
        this.chesses.push({
          id: chessInfo.id,
          name: chessInfo.name,
          sprite: chessSprite,
        });

        this.components.addComponent(
          chessSprite,
          new ChessComponent(
            this.server,
            chessInfo,
            this.handleFlipChess,
            this.handleSelectChess,
            this.handleRemoveChess,
            this.handleMoveChess
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
      scale: 0.34,
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

  private handleRemoveChess = (id: number) => {
    this.clearSelectedChessUI();
    const { chess, index } = this.getChessById(id);
    this.tweens.add({
      targets: chess.sprite,
      scale: 0,
      duration: 100,
      onComplete: () => {
        this.chesses.splice(index, 1);
        chess.sprite.destroy();
      },
    });
  };

  private handleMoveChess = (
    id: number,
    locationX: number,
    locationY: number
  ) => {
    // console.log('target', locationX, locationY);
    // this.clearSelectedChessUI();
    // const { x, y } = component.getLocation();
    // console.log(x, y);
    // const selected = this.getAt(x, y);
    // const targetChess = this.getAt(locationX, locationY);
    // const duration = 300;
    // const ease = Phaser.Math.Easing.Back.Out;
    // this.tweens.add({
    //   targets: selected.chess,
    //   x: targetChess.chess.x,
    //   y: targetChess.chess.y,
    //   duration,
    //   ease,
    //   onComplete: () => {
    //     targetChess.chess.destroy();
    //     this.chesses[selected.index] = targetChess.chess;
    //     component.setLoaction(locationX, locationY);
    //   },
    // });
    // this.tweens.add({
    //   targets: targetChess.chess,
    //   x: selected.chess.x,
    //   y: selected.chess.y,
    //   duration,
    //   ease,
    //   onComplete: () => {
    //     this.chesses[targetChess.index] = selected.chess;
    //     component.setLoaction(x, y);
    //   },
    // });
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
