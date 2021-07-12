import Phaser from 'phaser';
import { IComponent } from 'features/base/services/ComponentService';
import ChineseChessServer from '../ChineseChessServer';
import { ChessInfo } from '../models/ChineseChessState';
import { ChineseChessGroupMap } from '../models/ChineseChessGroup';
import { ChineseChessMessage } from '../models/ChineseChessMessage';

export class ChessComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  private server: ChineseChessServer;
  private chessInfo: ChessInfo;
  private x: number;
  private y: number;
  private isFlipped: boolean = false;
  private onFlip: (component: ChessComponent) => void;
  private onSelect: (component: ChessComponent) => void;

  constructor(
    server: ChineseChessServer,
    chessInfo: ChessInfo,
    x: number,
    y: number,
    onFlip: (component: ChessComponent) => void,
    onSelect: (component: ChessComponent) => void
  ) {
    this.server = server;
    this.chessInfo = chessInfo;
    this.x = x;
    this.y = y;
    this.onFlip = onFlip;
    this.onSelect = onSelect;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    // FIXME: 修正點選區域
    this.gameObject
      .setInteractive({ useHandCursor: true })
      .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
        this.handleClickChess,
        this
      );
  }

  update() {
    const changedChessInfo = this.server.changedChessInfo;
    if (
      changedChessInfo &&
      changedChessInfo.chessInfo.id === this.chessInfo.id
    ) {
      const { actionType, chessInfo } = changedChessInfo;
      switch (actionType) {
        case ChineseChessMessage.FlipChess:
          this.isFlipped = true;
          this.onFlip(this);
          break;
        case ChineseChessMessage.EatChess:
          // eat
          console.log('eat..', chessInfo);
          break;
        case ChineseChessMessage.MoveChess:
          break;
      }
      this.server.clearChangedChessInfo();
    }
  }

  destroy() {
    this.gameObject.off(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.handleClickChess,
      this
    );
  }

  getLocation() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  private handleClickChess() {
    if (!this.server.isYourTurn) {
      return;
    }

    if (!this.isFlipped) {
      this.server.flipChess(this.chessInfo.id);
    } else {
      if (
        this.server.yourGroup ===
          ChineseChessGroupMap[this.chessInfo.chessSide] &&
        this.server.selectedChessId !== this.chessInfo.id
      ) {
        // select chess
        this.onSelect(this);
        this.server.setSelectedChessId(this.chessInfo.id);
      } else if (
        this.server.selectedChessId &&
        this.server.yourGroup !== ChineseChessGroupMap[this.chessInfo.chessSide]
      ) {
        // eat chess
        this.server.eatChess(this.chessInfo.id);
      }
    }
  }
}
