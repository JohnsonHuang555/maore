import { RoomMessage } from '@domain/models/Message';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { mathFormulaSettingsSelector } from '@selectors/gameSettingsSelector';
import { isMasterSelector } from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useSelector } from 'react-redux';

const GameSettings = () => {
  const gameSettings = useSelector(mathFormulaSettingsSelector);
  const clientRoom = useSelector(clientRoomSelector);
  const isMaster = useSelector(isMasterSelector);

  if (!gameSettings) {
    return null;
  }

  const onWinnerPointChange = (event: SelectChangeEvent<number>) => {
    clientRoom?.send(RoomMessage.UpdateGameSettings, {
      winnerPoint: Number(event.target.value),
    });
  };

  const onRemainedSecondChange = (event: SelectChangeEvent<number>) => {
    clientRoom?.send(RoomMessage.UpdateGameSettings, {
      remainedSecond: Number(event.target.value),
    });
  };

  return (
    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel id="winner-point-label">勝利條件</InputLabel>
        <Select
          labelId="winner-point-label"
          value={gameSettings.winnerPoint || 20}
          label="勝利條件"
          disabled={!isMaster}
          onChange={onWinnerPointChange}
        >
          <MenuItem value={10}>10分</MenuItem>
          <MenuItem value={20}>20分</MenuItem>
          <MenuItem value={30}>30分</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="remained-second-label">回合秒數</InputLabel>
        <Select
          labelId="remained-second-label"
          value={gameSettings.remainedSecond || 60}
          label="回合秒數"
          disabled={!isMaster}
          onChange={onRemainedSecondChange}
        >
          <MenuItem value={30}>30秒</MenuItem>
          <MenuItem value={60}>60秒</MenuItem>
          <MenuItem value={90}>90秒</MenuItem>
        </Select>
        <FormHelperText>此設定適用於多人遊玩</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default GameSettings;
