import Phaser from 'phaser';
import { IComponent } from 'features/base/services/ComponentService';
import ChessServer from '../ChessServer';
import { Chess } from '../model/Chess';
// import { ChineseChessGroupMap } from '../models/ChineseChessGroup';

export class ChessComponent implements IComponent {
  private gameObject!: Phaser.GameObjects.GameObject;

  private server: ChessServer;
  private chessState: Chess;
  private x: number;
  private y: number;
  private onSelect: (component: ChessComponent) => void;

  constructor(
    server: ChessServer,
    chessState: Chess,
    x: number,
    y: number,
    onSelect: (component: ChessComponent) => void
  ) {
    this.server = server;
    this.chessState = chessState;
    this.x = x;
    this.y = y;
    this.onSelect = onSelect;
  }

  init(go: Phaser.GameObjects.GameObject) {
    this.gameObject = go;
  }

  awake() {
    this.gameObject
      .setInteractive({ useHandCursor: true })
      .on(
        Phaser.Input.Events.GAMEOBJECT_POINTER_UP,
        this.handleClickChess,
        this
      );
  }

  update() {
    const changedChessState = this.server.changedChessState;
    if (
      changedChessState &&
      changedChessState.chessState.id === this.chessState.id
    ) {
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

    if (
      this.server.yourSide === this.chessState.side &&
      this.server.selectedChessId !== this.chessState.id
    ) {
      // select chess
      this.onSelect(this);
      this.server.setSelectedChessId(this.chessState.id);
    } else if (
      this.server.selectedChessId &&
      this.server.yourSide !== this.chessState.side
    ) {
      // eat chess
    }
  }
}
