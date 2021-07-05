import Phaser from 'phaser';
import Server from 'features/chinese_chess/ChineseChessServer';
import { GameOverSceneData } from 'models/Scenes';
import {
  GameSceneData,
  PlayerGroup,
} from 'features/chinese_chess/models/ChineseChessScene';
import { ChessInfo } from 'features/chinese_chess/models/ChineseChessState';
import { ChineseChessGroup } from 'features/chinese_chess/models/ChineseChessGroup';
import ChessController from 'features/chinese_chess/controllers/ChessController';
import { sharedInstance as events } from 'features/base/EventCenter';

const MAX_PLAYERS = 2;
const GroupText = {
  [ChineseChessGroup.Black]: '黑方',
  [ChineseChessGroup.Red]: '紅方',
};
export default class Hidden extends Phaser.Scene {
  private server!: Server;
  private onGameOver!: (data: GameOverSceneData) => void;
  private selectedChessUI?: Phaser.GameObjects.Arc;
  private yourGroupText?: Phaser.GameObjects.Text;
  private otherGroupText?: Phaser.GameObjects.Text;
  private yourTurnText?: Phaser.GameObjects.Text;
  private chessesDictionary: { [key: string]: ChessInfo } = {};
  private chesses: ChessController[] = [];
  private changedChess?: Partial<ChessInfo>;

  constructor() {
    super('hidden');
  }

  init() {
    this.chesses = [];
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

    events.on('select-chess', this.handleSelectChess, this);
    events.on('clear-selected-chess-ui', this.handleClearSelectedChessUI, this);
  }

  update(t: number, dt: number) {
    this.chesses.forEach((chess) => chess.update(dt, this.changedChess));
    this.changedChess = undefined;
  }

  private createBoard = () => {
    const { width, height } = this.scale;
    const offsetX = 548;
    const offsetY = 235;
    const cellSize = 128;
    let drawX = width * 0.5 - offsetX;
    let drawY = height * 0.5 - offsetY;
    console.log(this.chessesDictionary);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 8; x++) {
        const chessInfo = this.chessesDictionary[`${x},${y}`];
        // const { alive, id } = chessInfo;
        // const cell = this.add
        //   .rectangle(drawX, drawY, size, size, 0xffffff, 0)
        //   .setInteractive()
        //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        //     // if () {
        //     //   this.server.moveChess(id, x, y)
        //     // }
        //   });
        this.chesses.push(
          new ChessController(
            this.server,
            this,
            chessInfo,
            drawX,
            drawY,
            cellSize
          )
        );
        // const chessImage = this.add
        //   .image(cell.x, cell.y, 'chess', 'hidden.png')
        //   .setDisplaySize(120, 120)
        //   .setInteractive()
        //   .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        //     this.server.flipChess(id);
        //   });

        // this.board.push({
        //   cell,
        //   chessImage: alive ? chessImage : undefined,
        //   chessInfo: alive ? chessInfo : undefined,
        //   isSelect: false,
        // });
        drawX += cellSize + 28;
      }
      drawY += cellSize + 28;
      drawX = width * 0.5 - offsetX;
    }

    this.server.onBoardChanged(this.handleBoardChanged, this);
    this.server.onPlayerTurnChanged(this.handlePlayerTurnChanged, this);
    this.server.onPlayerGroupChanged(this.handlePlayerGroupChanged, this);
  };

  private handleSelectChess(drawX: number, drawY: number, id: number) {
    this.clearSelectedChessUI();
    this.selectedChessUI = this.add
      .circle(drawX, drawY - 1.8, 50, 0xe05b5b, 0.3)
      .setDepth(1);
    console.log(this.selectedChessUI.depth);
    this.server.setSelectedChessId(id);
  }

  private handleClearSelectedChessUI() {
    this.clearSelectedChessUI();
  }

  // 棋盤更新
  private handleBoardChanged(chessInfo: Partial<ChessInfo>) {
    console.log(chessInfo, 'dddd');
    this.changedChess = chessInfo;
  }

  private clearSelectedChessUI() {
    this.selectedChessUI?.destroy();
    this.selectedChessUI = undefined;
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
