import { useSelector } from 'react-redux';
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
import { chineseChessHiddenSettingsSelector } from '@selectors/gameSettingsSelector';
import { isMasterSelector } from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';

const GameSettings = () => {
  const gameSettings = useSelector(chineseChessHiddenSettingsSelector);
  const clientRoom = useSelector(clientRoomSelector);
  const isMaster = useSelector(isMasterSelector);

  console.log(gameSettings);
  if (!gameSettings) {
    return null;
  }

  const onModeChange = (event: SelectChangeEvent<string>) => {
    clientRoom?.send(RoomMessage.UpdateGameSettings, {
      mode: event.target.value,
    });
  };

  return (
    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <FormControl fullWidth>
        <InputLabel id="remained-second-label">模式</InputLabel>
        <Select
          labelId="remained-second-label"
          value={gameSettings.mode || 'standard'}
          label="模式"
          disabled={!isMaster}
          onChange={onModeChange}
        >
          <MenuItem value="standard">標準</MenuItem>
          <MenuItem value="continuity">連吃</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default GameSettings;
