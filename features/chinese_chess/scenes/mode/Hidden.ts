import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import { GameSceneData } from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';

export default class Hidden extends Phaser.Scene {
  private server!: Server;
  private onGameOver!: (data: GameOverSceneData) => void;
  private board: { display: Phaser.GameObjects.Rectangle; value: ChessInfo }[] =
    [];

  private chessesDictionary: { [key: number]: ChessInfo } = {};

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
      this.chessesDictionary[chess.id] = chess;
    });

    // this.createBoard();
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const size = 128;
    let drawX = width * 0.2 - size;
    let drawY = height * 0.2 - size;
    let id = 1;
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = this.add
          .rectangle(drawX, drawY, size, size, 0xffffff)
          .setInteractive()
          .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            // this.server.makeSelection(idx);
          });
        const chessInfo = this.chessesDictionary[id];
        this.board.push({
          display: cell,
          value: chessInfo,
        });
        drawX += size + 5;
        id++;
      }
      drawY += size + 5;
      drawX = width * 0.5 - size;
    }
  };
}
