import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { GameSceneData } from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';

export default class Hidden extends Phaser.Scene {
  private server!: Server;
  private onGameOver!: (data: GameOverSceneData) => void;
  private board: {
    cell: Phaser.GameObjects.Rectangle;
    chessImage: Phaser.GameObjects.Arc;
    chessInfo: ChessInfo | undefined;
  }[] = [];

  private chessesDictionary: { [key: string]: ChessInfo } = {};

  constructor() {
    super('hidden');
  }

  preload() {
    this.load.svg('map', '/chinese_chess/HiddenMap.svg');
  }

  create(data: GameSceneData) {
    const { server, onGameOver } = data;
    this.server = server;
    this.onGameOver = onGameOver;

    if (!this.server) {
      throw new Error('server instance missing');
    }

    const { width, height } = this.scale;
    const map = this.add.image(width * 0.5, height * 0.5, 'map');
    map.setScale(2.5);
    const { chineseChesses } = this.server.gameState;
    chineseChesses.forEach((chess) => {
      this.chessesDictionary[`${chess.locationX},${chess.locationY}`] = chess;
    });
    this.createBoard();
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const offsetX = 438;
    const offsetY = 188;
    const size = 125;
    let drawX = width * 0.5 - offsetX;
    let drawY = height * 0.5 - offsetY;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const chessInfo = this.chessesDictionary[`${x},${y}`];
        const { alive, id, name, isFlipped } = chessInfo;
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff, 0)
          .setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            // if () {
            //   this.server.moveChess(id, x, y)
            // }
          });
        const chessImage = this.add
          .circle(cell.x, cell.y, 50, 0x2a76b8)
          .setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.server.flipChess(id);
          });
        // FIXME: 換成圖檔
        // if (!isFlipped) {
        //   this.add
        //     .circle(cell.x, cell.y, 50, 0x2a76b8)
        //     .setInteractive()
        //     .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        //       this.server.flipChess(id);
        //     });
        // } else {
        //   this.add.circle(cell.x, cell.y, 50, 0xffffff);
        //   this.add.text(cell.x, cell.y, name);
        // }
        this.board.push({
          cell,
          chessImage,
          chessInfo: alive ? chessInfo : undefined,
        });
        drawX += size;
      }
      drawY += size;
      drawX = width * 0.5 - offsetX;
    }

    this.server.onBoardChanged(this.handleBoardChanged, this);
  };

  private handleBoardChanged(chessInfo: ChessInfo) {
    const chess = this.board.find(
      (b) => b.chessInfo !== undefined && b.chessInfo.id === chessInfo.id
    );
    if (!chess) {
      return;
    }
    chess.chessInfo = {
      ...chess.chessInfo,
      ...chessInfo,
    };
    if (chessInfo.isFlipped) {
      chess.chessImage.setFillStyle(0xffffff);
      this.add.text(
        chess.chessInfo.locationX,
        chess.chessInfo.locationY,
        chess.chessInfo.name
      );
    }
  }
}
