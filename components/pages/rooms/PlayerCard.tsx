import MaoreFlex from '@components/maore/MaoreFlex';
import { Avatar, Box, Tooltip } from '@mui/material';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import { Player } from '@domain/models/Player';

type PlayerCardProps = {
  player?: Player;
  isNowTurn: boolean;
  isYou?: boolean;
  children?: React.ReactNode;
};

const PlayerCard = (props: PlayerCardProps) => {
  const { player, isYou = false, isNowTurn, children } = props;

  if (!player) {
    return null;
  }

  return (
    <MaoreFlex>
      <MaoreFlex verticalHorizonCenter sx={{ marginRight: '20px' }}>
        {player.photoURL ? (
          <Avatar
            sx={{
              width: { xs: 40, sm: 50, md: 70 },
              height: { xs: 40, sm: 50, md: 70 },
            }}
            src={player.photoURL}
          >
            {player.name.substring(0, 1)}
          </Avatar>
        ) : (
          <Avatar
            sx={{
              width: { xs: 40, sm: 50, md: 70 },
              height: { xs: 40, sm: 50, md: 70 },
            }}
          >
            {player.name.substring(0, 1)}
          </Avatar>
        )}
      </MaoreFlex>
      <MaoreFlex justifyContent="flex-start" sx={{ flexDirection: 'column' }}>
        <Box
          sx={{
            fontSize: { xs: '20px', sm: '22px', md: '26px' },
            marginBottom: '5px',
          }}
        >
          {isYou ? '你' : player.name}
        </Box>
        <MaoreFlex>
          {children}
          <MaoreFlex
            justifyContent="flex-start"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            {isNowTurn && (
              <Tooltip title="該玩家回合">
                <VideogameAssetIcon fontSize="medium" color="error" />
              </Tooltip>
            )}
          </MaoreFlex>
        </MaoreFlex>
      </MaoreFlex>
    </MaoreFlex>
  );
};

export default PlayerCard;
