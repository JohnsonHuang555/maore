import { store } from 'pages/_app';
import { updateGameStatus } from 'actions/RoomAction';
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
    this.room.state.onChange = (changes) => {
      changes.forEach((change) => {
        const { field, value } = change;
        switch (field) {
          case 'activePlayer': {
            this.events.emit('player-turn-changed', value);
            break;
          }
          case 'winningPlayer': {
            this.events.emit('player-win', value);
            break;
          }
          case 'gameStatus': {
            store.dispatch(updateGameStatus(value));
            break;
          }
        }
      });
    };

    this.room.state.chineseChesses.onChange = (item, idx) => {
      this.events.emit('board-changed', item, idx);
    };
  }
}
