import { GameMode } from 'models/Game';
import { RoomInfo } from 'models/Room';
import { MenuItem, Select } from '@material-ui/core';
import styles from 'styles/components/gameSetting.module.scss';

type GameSettingProps = {
  roomInfo: RoomInfo;
  gameModes?: GameMode[];
  isMaster: boolean;
  onChangeRoomInfo: (roomInfo: Partial<RoomInfo>) => void;
};

const GameSetting = (props: GameSettingProps) => {
  const { roomInfo, gameModes, isMaster, onChangeRoomInfo } = props;
  const { gameMode } = roomInfo;

  return (
    <>
      {gameMode && gameModes && (
        <>
          <div className={styles.title}>遊戲模式</div>
          <Select
            fullWidth
            labelId="game-mode-label"
            id="game-mode"
            value={roomInfo.gameMode}
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