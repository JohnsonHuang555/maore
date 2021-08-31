import { GameSceneData } from 'features/chinese_chess/models/ChineseChessScene';
import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Server from 'features/chinese_chess/ChineseChessServer';

export default class Standard extends Phaser.Scene {
  private server!: Server;
  private onGameOver!: () => void;

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
    this.load.image('map', '/chinese_chess/map/hidden_mode.png');
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
    }

    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, 'background');
    console.log(chineseChesses, 'ddd');
  }
}
