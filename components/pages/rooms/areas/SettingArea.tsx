import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { GamePack } from 'server/domain/Game';
import MathFormulaGameSettings from '../../../../features/math_formula_card/components/MathFormulaGameSettings';
import React from 'react';
import { useSelector } from 'react-redux';
import { isMasterSelector } from '@selectors/roomSelector';

const gameSettings: { [key: string]: React.ReactNode } = {
  [GamePack.MathFormulaCard]: <MathFormulaGameSettings />,
};

type SettingAreaProps = {
  gamePack: GamePack;
  disabledStartGame: boolean;
  isReadyGame: string;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onReadyGame: () => void;
};

const SettingArea = (props: SettingAreaProps) => {
  const isMaster = useSelector(isMasterSelector);

  const {
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
        padding: '15px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          fontSize: {
            xs: '18px',
            sm: '22px',
            lg: '26px',
          },
        }}
      >
        遊戲設定
      </Box>
      <Box sx={{ flex: '1', overflowX: 'auto' }}>
        {gameSettings[gamePack] || '此遊戲沒有設定'}
      </Box>
      {isMaster ? (
        <Button
          variant="contained"
          color="secondary"
          size="large"
          disableElevation
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
        sx={{
          backgroundColor: 'primary',
          ':hover': {
            backgroundColor: '#1f4558',
          },
          marginTop: '10px',
        }}
        variant="contained"
        size="large"
        disableElevation
        onClick={onLeaveRoom}
      >
        離開房間
      </Button>
    </Box>
  );
};

export default SettingArea;
