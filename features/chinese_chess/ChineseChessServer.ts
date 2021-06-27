import BaseServer from 'features/base/BaseServer';

export default class Server extends BaseServer {
  constructor() {
    super();
    this.handleStateChange();
  }

  onBoardChanged(cb: (cell: number, index: number) => void, context?: any) {
    this.events.on('board-changed', cb, context);
  }

  private handleStateChange() {
    this.room.state.chineseChesses.onChange = (item, idx) => {
      this.events.emit('board-changed', item, idx);
    };
  }
}
