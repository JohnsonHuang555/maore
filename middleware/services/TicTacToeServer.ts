import { AnyAction, Dispatch } from 'redux';

export default class TicTacToeServer {
  private dispatch: Dispatch<AnyAction>;
  constructor(dispatch: Dispatch<AnyAction>) {
    this.dispatch = dispatch;
  }
}
