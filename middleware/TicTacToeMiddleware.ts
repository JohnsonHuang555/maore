import { ActionType } from 'features/tictactoe/actions/ServerAction';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import Server from './services/TicTacToeServer';

let tictactoe: Server;
const TicTacToeMiddleware: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  (next) =>
  (action: any) => {
    tictactoe = new Server(dispatch);
    if (action && action.type) {
      const { server } = getState();
    }
  };
