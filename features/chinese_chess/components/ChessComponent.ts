import Phaser from 'phaser';
import { IComponent } from 'features/base/services/ComponentService';
import ChineseChessServer from '../ChineseChessServer';
import { ChessInfo } from '../@models/ChineseChessState';
import { ChineseChessGroupMap } from '../@models/ChineseChessGroup';
import { ChineseChessMessage } from '../@models/ChineseChessMessage';
import { GameMode } from '../@models/ChinesChessMode';

export class ChessComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  private server: ChineseChessServer;
  private chessInfo: ChessInfo;
  private isFlipped: boolean = false;
  private onFlip?: (id: number) => void;
  private onSelect: (id: number) => void;
  private onEat: (id: number, targetId: number) => void;
  private onMove: (
    id: number,
    targetLocationX: number,
    targetLocationY: number
  ) => void;

  constructor(
    server: ChineseChessServer,
    chessInfo: ChessInfo,
    onSelect: (id: number) => void,
    onEat: (id: number, targetId: number) => void,
    onMove: (
      id: number,
      targetLocationX: number,
      targetLocationY: number
    ) => void,
    onFlip?: (id: number) => void
  ) {
    this.server = server;
    this.chessInfo = chessInfo;
    this.onSelect = onSelect;
    this.onEat = onEat;
    this.onMove = onMove;
    this.onFlip = onFlip;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    // FIXME: 修正點選區域
    this.gameObject
      .setInteractive()
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
          if (!this.onFlip) {
            break;
          }
          this.isFlipped = true;
          this.onFlip(this.chessInfo.id);
          break;
        }
        case ChineseChessMessage.EatChess: {
          const { targetId } = chessInfo;
          this.onEat(this.chessInfo.id, targetId as number);
          break;
        }
        case ChineseChessMessage.MoveChess: {
          if (chessInfo.targetLocationX !== undefined) {
            this.chessInfo.locationX = chessInfo.targetLocationX;
            this.onMove(
              this.chessInfo.id,
              chessInfo.targetLocationX,
              this.chessInfo.locationY
            );
          } else if (chessInfo.targetLocationY !== undefined) {
            this.chessInfo.locationY = chessInfo.targetLocationY;
            this.onMove(
              this.chessInfo.id,
              this.chessInfo.locationX,
              chessInfo.targetLocationY
            );
          }
          break;
        }
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

  private handleClickChess() {
    if (
      this.server.showSurrenderModal ||
      this.server.isGameOver ||
      !this.server.isYourTurn
    ) {
      return;
    }

    const { id, chessSide } = this.chessInfo;
    if (!this.isFlipped && this.server.roomInfo.gameMode === GameMode.Hidden) {
      this.server.flipChess(id);
    } else {
      if (
        this.server.yourGroup === ChineseChessGroupMap[chessSide] &&
        this.server.selectedChessId !== id
      ) {
        // select chess
        this.onSelect(id);
        this.server.setSelectedChessId(id);
      } else if (
        this.server.selectedChessId &&
        this.server.yourGroup !== ChineseChessGroupMap[chessSide]
      ) {
        // eat chess
        this.server.eatChess(this.chessInfo);
      }
    }
  }
}
