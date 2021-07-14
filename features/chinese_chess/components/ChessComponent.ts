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
  private isFlipped: boolean = false;
  private onFlip: (id: number) => void;
  private onSelect: (id: number) => void;
  private onRemove: (id: number) => void;
  private onMove: (id: number, locationX: number, locationY: number) => void;

  constructor(
    server: ChineseChessServer,
    chessInfo: ChessInfo,
    onFlip: (id: number) => void,
    onSelect: (id: number) => void,
    onRemove: (id: number) => void,
    onMove: (id: number, locationX: number, locationY: number) => void
  ) {
    this.server = server;
    this.chessInfo = chessInfo;
    this.onFlip = onFlip;
    this.onSelect = onSelect;
    this.onRemove = onRemove;
    this.onMove = onMove;
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
    if (changedChessInfo?.chessInfo.id === this.chessInfo.id) {
      const { actionType, chessInfo } = changedChessInfo;
      switch (actionType) {
        case ChineseChessMessage.FlipChess: {
          this.isFlipped = true;
          this.onFlip(this.chessInfo.id);
          break;
        }
        case ChineseChessMessage.EatChess: {
          const { targetId, targetLocationX, targetLocationY } = chessInfo;
          this.onRemove(targetId as number);
          this.onMove(
            this.chessInfo.id,
            targetLocationX as number,
            targetLocationY as number
          );
          break;
        }
        case ChineseChessMessage.MoveChess: {
          // if (chessInfo.locationX) {
          //   this.onMove(this, chessInfo.locationX, this.chessInfo.locationY);
          // } else if (chessInfo.locationY) {
          //   this.onMove(this, this.chessInfo.locationX, chessInfo.locationY);
          // }
          break;
        }
      }
      this.server.clearChangedChessInfo();
    }
  }

  destroy() {
    console.log('destroy??');
    this.gameObject.off(
      Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
      this.handleClickChess,
      this
    );
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
        this.onSelect(this.chessInfo.id);
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
