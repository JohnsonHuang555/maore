import { RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { GameStatus, Metadata, RoomInfo } from 'models/Room';

export enum ActionType {
  LOADED_ROOMS = 'LOADED_ROOMS',
  CREATED_ROOM = 'CREATED_ROOM',
  SET_ROOM_INFO = 'SET_ROOM_INFO',
  SET_YOUR_PLAYERID = 'SET_YOUR_PLAYERID',
  ADD_PLAYER = 'ADD_PLAYER',
  REMOVE_PLAYER = 'REMOVE_PLAYER',
  SET_PLAYER_READY = 'SET_PLAYER_READY',
  SET_PLAYER_MASTER = 'SET_PLAYER_MASTER',
  SET_PLAYER_INDEX = 'SET_PLAYER_INDEX',
  UPDATE_GAME_STATUS = 'UPDATE_GAME_STATUS',
  SET_SHOW_GAME_SCREEN = 'SET_SHOW_GAME_SCREEN',
  UPDATE_WINNING_PLAYER = 'UPDATE_WINNING_PLAYER',
  UPDATE_ACTIVIE_PLAYER = 'UPDATE_ACTIVIE_PLAYER',
  RESET = 'RESET',
}

export const loadedRooms = (rooms: RoomAvailable<Metadata>[]) => {
  return {
    type: ActionType.LOADED_ROOMS,
    rooms,
  };
};

export const createdRoom = (roomId: string) => {
  return {
    type: ActionType.CREATED_ROOM,
    roomId,
  };
};

export const setRoomInfo = (roomInfo: Partial<RoomInfo>) => {
  return {
    type: ActionType.SET_ROOM_INFO,
    roomInfo,
  };
};

export const addPlayer = (player: Player) => {
  return {
    type: ActionType.ADD_PLAYER,
    player,
  };
};

export const removePlayer = (id: string) => {
  return {
    type: ActionType.REMOVE_PLAYER,
    id,
  };
};

export const setYourPlayerId = (yourPlayerId: string) => {
  return {
    type: ActionType.SET_YOUR_PLAYERID,
    yourPlayerId,
  };
};

export const setPlayerReady = (id: string, isReady: boolean) => {
  return {
    type: ActionType.SET_PLAYER_READY,
    id,
    isReady,
  };
};

export const setPlayerMaster = (id: string, isMaster: boolean) => {
  return {
    type: ActionType.SET_PLAYER_MASTER,
    id,
    isMaster,
  };
};

export const setPlayerIndex = (id: string, playerIndex: number) => {
  return {
    type: ActionType.SET_PLAYER_INDEX,
    id,
    playerIndex,
  };
};

export const updateGameStatus = (gameStatus: GameStatus) => {
  return {
    type: ActionType.UPDATE_GAME_STATUS,
    gameStatus,
  };
};

export const setShowGameScreen = (show: boolean) => {
  return {
    type: ActionType.SET_SHOW_GAME_SCREEN,
    show,
  };
};

export const updateWinningPlayer = (playerIndex: number) => {
  return {
    type: ActionType.UPDATE_WINNING_PLAYER,
    playerIndex,
  };
};

export const updateActivePlayer = (playerIndex: number) => {
  return {
    type: ActionType.UPDATE_ACTIVIE_PLAYER,
    playerIndex,
  };
};

export const reset = () => {
  return {
    type: ActionType.RESET,
  };
};
