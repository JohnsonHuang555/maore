import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import People from '@mui/icons-material/People';

type RoomCardProps = {
  title: string;
  maxPlayers: number;
  nowPlayers: number;
  joinRoom: () => void;
};

const RoomCard = (props: RoomCardProps) => {
  const { title, maxPlayers, nowPlayers, joinRoom } = props;
  return (
    <Box
      sx={{
        padding: '15px',
        borderRadius: '10px',
        backgroundColor: 'primary.dark',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <Box
        sx={{
          fontSize: '24px',
          marginBottom: '15px',
          backgroundColor: 'primary.light',
          borderRadius: '5px',
          padding: '2px 15px',
        }}
      >
        {title}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            backgroundColor: 'primary.light',
            borderRadius: '5px',
            padding: '0 5px',
            flex: {
              xs: 0.5,
              sm: 1,
            },
            letterSpacing: '1px',
          }}
        >
          Waiting
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px',
            flex: 0.5,
            backgroundColor: 'primary.light',
            borderRadius: '5px',
            padding: '0 5px',
          }}
        >
          <People />
          <Box
            sx={{ fontSize: '16px', marginLeft: '5px' }}
          >{`${nowPlayers} / ${maxPlayers}`}</Box>
        </Box>
        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'primary.dark',
            borderRadius: '5px',
            padding: '0 5px',
          }}
        >
          <VideogameAsset />
          <Box sx={{ fontSize: '16px', marginLeft: '5px' }}>標準</Box>
        </Box> */}
        <Button
          sx={{ flex: 0.5 }}
          color="secondary"
          variant="contained"
          onClick={joinRoom}
          disableElevation
        >
          加入
        </Button>
      </Box>
    </Box>
  );
};

export default RoomCard;
