import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GameMode } from '@domain/models/Game';
import { RoomInfo } from '@domain/models/Room';
import GameSetting from '@components/rooms/GameSetting';

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
    <Box
      sx={{
        height: 'calc(100% - 15px)',
        backgroundColor: 'primary.dark',
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flex: '1' }}>
        <GameSetting
          roomInfo={roomInfo}
          gameModes={gameModes}
          isMaster={isMaster}
          onChangeRoomInfo={() => {}}
        />
      </Box>
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
        sx={{ marginTop: '10px' }}
        onClick={onLeaveRoom}
      >
        離開房間
      </Button>
    </Box>
  );
};

export default SettingArea;
