import { ActionType } from 'actions/ServerAction';
import Server from './services/RoomServer';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

let roomServer: Server;
const ServerMiddleware: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  (next) =>
  (action: any) => {
    if (action && action.type) {
      const { server } = getState();
      switch (action.type) {
        case ActionType.INITIAL_CLIENT: {
          roomServer = new Server(dispatch);
          break;
        }
        case ActionType.GET_ALL_ROOMS: {
          roomServer.getAllRooms(server.client, action.gamePack);
          break;
        }
        case ActionType.CREATE_ROOM: {
          roomServer.createRoom(server.client, action.gamePack, {
            roomTitle: action.roomTitle,
            playerName: action.playerName,
            gamePack: action.gamePack,
            gameMode: action.gameMode,
          });
          break;
        }
        case ActionType.JOIN_ROOM: {
          roomServer.joinRoom(server.client, action.roomId, {
            playerName: action.playerName,
          });
          break;
        }
        case ActionType.LEAVE_ROOM: {
          roomServer.leaveRoom(server.room);
          break;
        }
        case ActionType.READY_GAME: {
          roomServer.readyGame(server.room);
          break;
        }
        case ActionType.START_GAME: {
          roomServer.startGame(server.room);
          break;
        }
      }
    }
    return next(action);
  };

export default ServerMiddleware;
