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
  SET_PLAYER_ORDER = 'SET_PLAYER_ORDER',
  UPDATE_PLAYER_INFO = 'UPDATE_PLAYER_INFO',
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

export const setPlayerInfo = (id: string, playerInfo: Partial<Player>) => {
  return {
    type: ActionType.UPDATE_PLAYER_INFO,
    id,
    playerInfo,
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
