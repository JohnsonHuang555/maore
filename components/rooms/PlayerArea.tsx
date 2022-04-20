import Box from '@mui/material/Box';
import { Player } from '@domain/models/Player';
import { Stars, AccountCircle } from '@mui/icons-material';

type PlayerAreaProps = {
  players: Player[];
  yourPlayerId: string;
};

const PlayerArea = (props: PlayerAreaProps) => {
  const { players, yourPlayerId } = props;

  const isNowPlayer = (id: string) => {
    return id === yourPlayerId ? true : false;
  };

  return (
    <Box
      sx={{
        flex: '300px',
        marginBottom: '15px',
        backgroundColor: 'primary.dark',
        padding: '10px',
        borderRadius: '10px',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          width: '100%',
        }}
      >
        {players.map((player) => (
          <Box
            key={player.id}
            sx={{
              display: 'flex',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px',
              ':nth-of-type(odd)': {
                marginRight: '10px',
                width: 'calc(100% / 2)',
              },
              ':nth-of-type(even)': {
                width: 'calc(100% / 2 - 10px)',
              },
              backgroundColor: isNowPlayer(player.id) ? '#64584b' : '#3b3b3b',
            }}
          >
            <AccountCircle sx={{ fontSize: '52px' }} htmlColor="#cccccc" />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                flex: 1,
                justifyContent: 'space-between',
                marginLeft: '10px',
              }}
            >
              <Box
                sx={{
                  fontSize: '24px',
                  padding: '8px 10px',
                  borderRadius: '5px',
                  marginBottom: '6px',
                  backgroundColor: isNowPlayer(player.id)
                    ? '#342f29'
                    : '#1d1d1d',
                }}
              >
                {player.name}
              </Box>
              {!player.isMaster ? (
                <Box
                  sx={{
                    fontSize: '24px',
                    color: player.isReady ? 'warning.light' : '#342f29',
                  }}
                >
                  Ready
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 5px',
                  }}
                >
                  <Stars sx={{ color: 'warning.light' }} />
                  <Box sx={{ fontSize: '24px', marginLeft: '5px' }}>房主</Box>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PlayerArea;
