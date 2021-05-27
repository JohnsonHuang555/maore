import { ActionType } from 'actions/ServerAction';
import Server from './services/RoomServer';
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
          if (action.gamePack) {
            server.getAllRooms(action.gamePack);
          }
          break;
        }
        case ActionType.CREATE_ROOM: {
          server.createRoom(action.gamePack, {
            roomTitle: action.roomTitle,
            playerName: action.playerName,
          });
          break;
        }
        case ActionType.JOIN_ROOM: {
          server.joinRoom(action.roomId, {
            playerName: action.playerName,
          });
          break;
        }
        case ActionType.LEAVE_ROOM: {
          server.leaveRoom();
          break;
        }
      }
    }
    return next(action);
  };

export default ServerMiddleware;
