import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GameList } from 'server/domain/Game';
import MathFormulaGameSettings from './game_settings/MathFormulaGameSettings';
import React from 'react';
import { useSelector } from 'react-redux';
import { isMasterSelector } from '@selectors/roomSelector';

const gameSettings: { [key: string]: React.ReactNode } = {
  [GameList.MathFormulaCard]: <MathFormulaGameSettings />,
};

type SettingAreaProps = {
  // gameModes: GameMode[];
  gamePack: GameList;
  disabledStartGame: boolean;
  isReadyGame: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onReadyGame: () => void;
};

const SettingArea = (props: SettingAreaProps) => {
  const isMaster = useSelector(isMasterSelector);

  const {
    // gameModes,
    gamePack,
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
      <Box sx={{ fontSize: '26px' }}>遊戲設定</Box>
      <Box sx={{ flex: '1', overflowX: 'auto' }}>{gameSettings[gamePack]}</Box>
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
          disableElevation
          onClick={onReadyGame}
        >
          {isReadyGame}
        </Button>
      )}
      <Button
        color="primary"
        variant="contained"
        size="large"
        disableElevation
        sx={{ marginTop: '10px' }}
        onClick={onLeaveRoom}
      >
        離開房間
      </Button>
    </Box>
  );
};

export default SettingArea;
