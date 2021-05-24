import { ActionType } from 'actions/ServerAction';
import Server from './services/Server';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

let server: Server;
const ServerMiddleware: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action: any) => {
    if (action && action.type) {
      switch (action.type) {
        case ActionType.INITIAL_CLIENT: {
          server = new Server(dispatch);
          server.joinLobby();
          break;
        }
        case ActionType.CREATE_ROOM: {
          server.createRoom(action.gamePack, {
            roomTitle: action.roomTitle,
          });
          break;
        }
        case ActionType.JOIN_ROOM: {
          server.joinRoom(action.roomId);
          break;
        }
      }
    }
    return next(action);
  };

export default ServerMiddleware;
