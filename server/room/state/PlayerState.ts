import { Schema, type } from '@colyseus/schema';
import { Payload } from '../commands/PlayerJoinedCommand';

// An abstract player object
export class PlayerState extends Schema {
  @type('string')
  id: string;

  // 玩家名稱
  @type('string')
  name: string;

  @type('string')
  photoURL: string;

  // 是否為房主
  @type('boolean')
  isMaster: boolean;

  // 是否已準備 房主永遠為 true
  @type('boolean')
  isReady: boolean;

  // 加入房間流水號 from 0
  @type('number')
  playerIndex: number = -1;

  // 玩家順序
  @type('number')
  playerOrder: number = -1;

  // 遊戲畫面載入是否完成
  @type('boolean')
  gameLoaded: boolean = false;

  // 組別
  @type('string')
  group: string = '';

  // 玩家遊戲中
  @type('boolean')
  isPlaying: boolean = false;

  constructor(data: Payload) {
    super();
    const { id, name, isMaster, playerIndex, photoURL } = data;
    this.id = id;
    this.name = name;
    this.photoURL = photoURL;
    this.isMaster = isMaster;
    this.playerIndex = playerIndex;
    this.isReady = isMaster ? true : false;
  }
}
