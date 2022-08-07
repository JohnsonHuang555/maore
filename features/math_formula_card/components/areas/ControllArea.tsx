import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

type ControlAreaProps = {
  onRuleClick: () => void;
};

// 控制區塊
const ControlArea = (props: ControlAreaProps) => {
  const { onRuleClick } = props;
  return (
    <Box sx={{ position: 'absolute', top: '25px', right: '50px' }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Tooltip title="規則說明">
          <IconButton size="large" aria-label="game-rule" onClick={onRuleClick}>
            <DescriptionOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="離開遊戲">
          <IconButton
            size="large"
            aria-label="leave_room"
            onClick={() => (location.href = '/games/math-formula-card')}
          >
            <LogoutIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default ControlArea;
