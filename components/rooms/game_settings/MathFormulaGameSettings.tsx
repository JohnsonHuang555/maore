import { RoomMessage } from '@domain/models/Message';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { gameSettingsSelector } from '@selectors/game_settings/mathFormulaSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useSelector } from 'react-redux';

const MathFormulaGameSettings = () => {
  const gameSettings = useSelector(gameSettingsSelector);
  const clientRoom = useSelector(clientRoomSelector);

  const onWinnerPointChange = (event: SelectChangeEvent<number>) => {
    clientRoom?.send(RoomMessage.UpdateGameSettings, {
      winnerPoint: Number(event.target.value),
    });
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="winner-point-label">勝利條件</InputLabel>
        <Select
          labelId="winner-point-label"
          value={gameSettings?.winnerPoint}
          label="勝利條件"
          onChange={onWinnerPointChange}
        >
          <MenuItem value={10}>10分</MenuItem>
          <MenuItem value={20}>20分</MenuItem>
          <MenuItem value={30}>30分</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default MathFormulaGameSettings;
