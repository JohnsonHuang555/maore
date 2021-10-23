import Box from '@mui/material/Box';
import { Player } from 'models/Player';
import { Stars, AccountCircle } from '@mui/icons-material';
import styles from 'styles/components/playerList.module.scss';

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
    <Box sx={{ flex: '1', marginBottom: '15px' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          backgroundColor: '#121314',
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
                width: 'calc(100% / 2 - 10px)',
              },
              ':nth-of-type(even)': {
                width: 'calc(100% / 2 - 10px)',
              },
              backgroundColor: isNowPlayer(player.id) ? '#64584b' : '#3b3b3b',
            }}
          >
            <AccountCircle htmlColor="#cccccc" />
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
                    fontSize: '26px',
                    color: player.isReady ? '#e2c138' : '#342f29',
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
                    fontSize: '28px',
                  }}
                >
                  <Stars htmlColor="#e2c138" />
                  <Box sx={{ fontSize: '20px', marginLeft: '5px' }}>房主</Box>
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
