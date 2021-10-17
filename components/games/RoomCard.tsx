import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import People from '@mui/icons-material/People';
import VideogameAsset from '@mui/icons-material/VideogameAsset';

type RoomCardProps = {
  title: string;
  maxPlayers: number;
  nowPlayers: number;
  joinRoom: () => void;
};

const RoomCard = (props: RoomCardProps) => {
  const { title, maxPlayers, nowPlayers, joinRoom } = props;
  return (
    <Box sx={{ padding: '15px', borderRadius: '10px', border: '1px solid' }}>
      <Box sx={{ fontSize: '24px', marginBottom: '5px' }}>{title}</Box>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <People />
          <Box
            sx={{ fontSize: '16px', marginLeft: '5px' }}
          >{`${nowPlayers} / ${maxPlayers}`}</Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <VideogameAsset />
          <Box sx={{ fontSize: '16px', marginLeft: '5px' }}>暗棋</Box>
        </Box>
        <Box sx={{ flex: 1 }}></Box>
        <Button sx={{ flex: 1 }} variant="contained" onClick={joinRoom}>
          加入
        </Button>
      </Box>
    </Box>
  );
};

export default RoomCard;
