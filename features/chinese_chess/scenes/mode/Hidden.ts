import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { GameSceneData } from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessGroupMap } from 'features/chinese_chess/models/ChineseChessGroup';

export default class Hidden extends Phaser.Scene {
  private server!: Server;
  private onGameOver!: (data: GameOverSceneData) => void;
  private board: {
    cell: Phaser.GameObjects.Rectangle;
    chessImage: Phaser.GameObjects.Image | undefined;
    chessInfo: ChessInfo | undefined;
    isSelect: boolean;
  }[] = [];
  private selectedChessUI?: Phaser.GameObjects.Arc;
  private gameStateText?: Phaser.GameObjects.Text;
  private chessesDictionary: { [key: string]: ChessInfo } = {};

  constructor() {
    super('hidden');
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
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const offsetX = 548;
    const offsetY = 235;
    const size = 125;
    let drawX = width * 0.5 - offsetX;
    let drawY = height * 0.5 - offsetY;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const chessInfo = this.chessesDictionary[`${x},${y}`];
        const { alive, id } = chessInfo;
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff, 0)
          .setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            // if () {
            //   this.server.moveChess(id, x, y)
            // }
          });
        const chessImage = this.add
          .image(cell.x, cell.y, 'chess', 'hidden.png')
          .setDisplaySize(120, 120)
          .setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.server.flipChess(id);
          });

        this.board.push({
          cell,
          chessImage: alive ? chessImage : undefined,
          chessInfo: alive ? chessInfo : undefined,
          isSelect: false,
        });
        drawX += size + 31;
      }
      drawY += size + 31;
      drawX = width * 0.5 - offsetX;
    }

    this.server.onBoardChanged(this.handleBoardChanged, this);
    this.server.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
  };

  private handlePlayerTurnChanged(playerIndex: number) {
    if (
      this.server.playerInfo.playerIndex === playerIndex &&
      !this.gameStateText
    ) {
      const { width } = this.scale;
      this.gameStateText = this.add
        .text(width * 0.5, 50, '你的回合')
        .setOrigin(0.5);
    } else {
      this.gameStateText?.destroy();
      this.gameStateText = undefined;
    }
  }

  private handleBoardChanged(chessInfo: Partial<ChessInfo>) {
    // 拿到新的棋子更新到棋盤上
    this.board.forEach((b) => {
      if (b.chessInfo && b.chessImage && b.chessInfo.id === chessInfo.id) {
        // 刪除原本的圖
        b.chessImage.destroy();
        // 放上新的圖
        b.chessImage = this.add
          .image(b.cell.x, b.cell.y, 'chess', `${b.chessInfo.name}.png`)
          .setDisplaySize(120, 120)
          .setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            if (
              b.chessInfo &&
              this.server.yourGroup ===
                ChineseChessGroupMap[b.chessInfo.chessSide]
            ) {
              this.selectedChessUI?.destroy();
              this.selectedChessUI = undefined;
              this.server.setSelectedChessId(b.chessInfo?.id as number);
              this.selectedChessUI = this.add.circle(
                b.cell.x,
                b.cell.y - 1.8,
                50,
                0xe05b5b,
                0.3
              );
            } else {
              this.selectedChessUI?.destroy();
              this.selectedChessUI = undefined;
            }
          });
        b.chessInfo = {
          ...b.chessInfo,
          ...chessInfo,
        };
      }
    });
  }
}
