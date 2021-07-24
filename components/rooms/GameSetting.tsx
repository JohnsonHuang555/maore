import { GameMode } from 'features/chinese_chess/models/ChinesChessMode';
import { GameList } from 'models/Game';
import styles from 'styles/components/gameSetting.module.scss';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { RoomInfo } from 'models/Room';

type GameSettingProps = {
  gamePack: GameList | '';
  settings?: string;
  currentGameMode?: string;
  onChange: (roomInfo: Partial<RoomInfo>) => void;
};

const GameSetting = (props: GameSettingProps) => {
  const { gamePack, settings, currentGameMode, onChange } = props;

  const playingGame: { [key: string]: string[] } = {
    [GameList.ChineseChess]: [GameMode.Standard, GameMode.Hidden],
  };

  return (
    <div className={styles.gameSetting}>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={currentGameMode}
        onChange={(e) => onChange({ gameMode: e.target.value as string })}
        label="Age"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </div>
  );
};

export default GameSetting;
