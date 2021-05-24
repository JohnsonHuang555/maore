import { ActionType } from 'actions/ServerAction';
import Server from './services/Server';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

let server: Server;
const ServerMiddleware: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    if (action && action.type) {
      switch (action.type) {
        case ActionType.INITIAL_CLIENT: {
          server = new Server(dispatch);
          server.joinLobby();
          break;
        }
      }
    }
    return next(action);
  };

export default ServerMiddleware;
