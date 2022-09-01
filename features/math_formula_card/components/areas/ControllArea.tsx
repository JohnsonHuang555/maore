import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AlarmIcon from '@mui/icons-material/Alarm';

type ControlAreaProps = {
  showTimer: boolean;
  timer: number;
  onRuleClick: () => void;
};

// 控制區塊
const ControlArea = (props: ControlAreaProps) => {
  const { showTimer, timer, onRuleClick } = props;
  return (
    <Box
      sx={{
        position: 'absolute',
        top: {
          xs: '10px',
          sm: '10px',
          md: '15px',
          lg: '25px',
        },
        right: {
          xs: '10px',
          sm: '10px',
          md: '30px',
          lg: '50px',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {showTimer && (
          <Tooltip title="剩餘時間">
            <>
              <IconButton size="large">
                <AlarmIcon
                  sx={{
                    fontSize: {
                      xs: '24px',
                      sm: '28px',
                      md: '32px',
                      lg: '36px',
                    },
                  }}
                />
              </IconButton>
              <Box
                sx={{
                  fontSize: {
                    xs: '24px',
                    sm: '22px',
                    md: '26px',
                    lg: '30px',
                  },
                  margin: '0px !important',
                }}
              >
                {timer}
              </Box>
            </>
          </Tooltip>
        )}
        <Tooltip title="規則說明">
          <IconButton
            size="large"
            onClick={onRuleClick}
            sx={{
              margin: {
                xs: '0',
                sm: '0 5px',
                md: '0 10px',
              },
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: {
                  xs: '24px',
                  sm: '28px',
                  md: '32px',
                  lg: '36px',
                },
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="離開遊戲">
          <IconButton
            size="large"
            onClick={() => (location.href = '/games/math-formula-card')}
          >
            <LogoutIcon
              sx={{
                fontSize: {
                  xs: '24px',
                  sm: '28px',
                  md: '32px',
                  lg: '36px',
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default ControlArea;
