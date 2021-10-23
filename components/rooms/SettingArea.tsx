import Button from '@mui/material/Button';
import { GameMode } from 'models/Game';
import { RoomInfo } from 'models/Room';
import React from 'react';
import GameSetting from './GameSetting';

type SettingAreaProps = {
  roomInfo: RoomInfo;
  gameModes: GameMode[];
  isMaster: boolean;
  disabledStartGame: boolean;
  isReadyGame: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onReadyGame: () => void;
};

const SettingArea = (props: SettingAreaProps) => {
  const {
    roomInfo,
    gameModes,
    isMaster,
    disabledStartGame,
    isReadyGame,
    onLeaveRoom,
    onStartGame,
    onReadyGame,
  } = props;
  return (
    <div>
      <div>
        <GameSetting
          roomInfo={roomInfo}
          gameModes={gameModes}
          isMaster={isMaster}
          onChangeRoomInfo={() => {}}
        />
      </div>
      {isMaster ? (
        <Button
          variant="contained"
          color="secondary"
          size="large"
          disabled={disabledStartGame}
          onClick={onStartGame}
        >
          開始遊戲
        </Button>
      ) : (
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={onReadyGame}
        >
          {isReadyGame}
        </Button>
      )}
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={onLeaveRoom}
      >
        離開房間
      </Button>
    </div>
  );
};

export default SettingArea;
