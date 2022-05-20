import { GameMode } from '@domain/models/Game';
import { RoomInfo } from '@domain/models/Room';
import { MenuItem, Select } from '@mui/material';
import styles from '@styles/components/gameSetting.module.scss';

type GameSettingProps = {
  roomInfo: RoomInfo;
  gameModes: GameMode[];
  isMaster: boolean;
  onChangeRoomInfo: (roomInfo: Partial<RoomInfo>) => void;
};

const GameSetting = (props: GameSettingProps) => {
  const { roomInfo, gameModes, isMaster, onChangeRoomInfo } = props;
  const { gameMode } = roomInfo;

  return (
    <>
      {gameMode && (
        <>
          <div className={styles.title}>遊戲模式</div>
          <Select
            fullWidth
            labelId="game-mode-label"
            id="game-mode"
            value={gameMode}
            onChange={(e) =>
              onChangeRoomInfo({ gameMode: e.target.value as string })
            }
            variant="outlined"
            disabled={!isMaster}
          >
            {gameModes.map((mode, idx) => (
              <MenuItem key={idx} value={mode.value}>
                <em>{mode.label}</em>
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </>
  );
};

export default GameSetting;
