import { GameList, GameMode } from 'models/Game';
import styles from 'styles/components/gameSetting.module.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { RoomInfo } from 'models/Room';
import { EnhanceGameModes as ChineseChessModes } from 'features/chinese_chess/models/ChinesChessMode';

type GameSettingProps = {
  gamePack: GameList | '';
  settings?: string;
  currentGameMode?: string;
  onChange: (roomInfo: Partial<RoomInfo>) => void;
};

const GameSetting = (props: GameSettingProps) => {
  const { gamePack, settings, currentGameMode, onChange } = props;

  const playingGame: { [key: string]: GameMode[] } = {
    [GameList.ChineseChess]: ChineseChessModes,
  };

  return (
    <div className={styles.gameSetting}>
      {currentGameMode && (
        <Select
          labelId="game-mode-label"
          id="game-mode"
          value={currentGameMode}
          variant="outlined"
          onChange={(e) => onChange({ gameMode: e.target.value as string })}
          label="遊戲模式"
        >
          {playingGame[gamePack].map((m, idx) => (
            <MenuItem key={idx} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
};

export default GameSetting;
