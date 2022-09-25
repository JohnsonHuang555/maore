import Box from '@mui/material/Box';
import { Player } from '@domain/models/Player';
import { Stars } from '@mui/icons-material';
import { Avatar, IconButton, Stack, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type PlayerAreaProps = {
  roomTitle: string;
  players: Player[];
  yourPlayerId: string;
  onEditRoom: () => void;
};

const PlayerArea = (props: PlayerAreaProps) => {
  const { roomTitle, players, yourPlayerId, onEditRoom } = props;

  const isNowPlayer = (id: string) => {
    return id === yourPlayerId ? true : false;
  };

  return (
    <Box
      sx={{
        flex: '300px',
        marginBottom: '15px',
        backgroundColor: 'primary.dark',
        padding: '15px',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          fontSize: {
            xs: '18px',
            sm: '22px',
            lg: '26px',
          },
          marginBottom: '10px',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>房名: {roomTitle}</Box>
          <Box>
            <Tooltip title="當房間只剩一人時重整頁面會關閉此房間，需重新建立房間">
              <IconButton>
                <InfoOutlinedIcon
                  sx={{
                    fontSize: {
                      xs: '18px',
                      sm: '22px',
                      lg: '26px',
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="編輯房間資訊">
              <IconButton onClick={onEditRoom}>
                <EditOutlinedIcon
                  sx={{
                    fontSize: {
                      xs: '18px',
                      sm: '22px',
                      lg: '26px',
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Box>
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
                xs: {
                  width: '100%',
                },
                md: {
                  marginRight: '10px',
                  width: 'calc(100% / 2)',
                },
              },
              ':nth-of-type(even)': {
                xs: {
                  width: '100%',
                },
                md: {
                  width: 'calc(100% / 2 - 10px)',
                },
              },
              backgroundColor: isNowPlayer(player.id) ? '#64584b' : '#535353',
            }}
          >
            {player.photoURL ? (
              <Avatar
                sx={{
                  width: { xs: 40, sm: 50, md: 70 },
                  height: { xs: 40, sm: 50, md: 70 },
                }}
                src={player.photoURL}
              />
            ) : (
              <Avatar
                sx={{
                  width: { xs: 40, sm: 50, md: 70 },
                  height: { xs: 40, sm: 50, md: 70 },
                  color: '#fff',
                }}
              >
                {player.name.substring(0, 1)}
              </Avatar>
            )}
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
                    ? '#3d3834'
                    : '#343a3d',
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
