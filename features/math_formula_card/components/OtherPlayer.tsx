import { Avatar, Box, Tooltip } from '@mui/material';
import { OthersPlayerInfo } from '../models/OtherPlayerCard';
import Card from './Card';
import CloseIcon from '@mui/icons-material/Close';
import MaoreFlex from '@components/maore/MaoreFlex';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

type OtherPlayerProps = OthersPlayerInfo & {
  isNowTurn: boolean;
  playerCount: number;
};

const OtherPlayer = (props: OtherPlayerProps) => {
  const { remainCardCount, name, point, playerCount, isNowTurn } = props;

  const renderCards = () => {
    const cards = [];
    for (let i = 0; i < remainCardCount; i++) {
      cards.push(
        <Card
          key={i}
          hideCard={true}
          iconSize="small"
          iconColor="#E9C46A"
          bgColor="#E76F51"
          width={50}
        />
      );
    }
    return cards;
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Avatar sx={{ width: 70, height: 70 }}>{name.substring(0, 1)}</Avatar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            margin: '0 30px',
          }}
        >
          <Box sx={{ fontSize: '26px', marginBottom: '5px' }}>{name}</Box>
          <MaoreFlex
            sx={{ width: '100%' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ fontSize: '24px' }}>{point} 分</Box>
            {isNowTurn && (
              <Tooltip title="該玩家回合">
                <VideogameAssetIcon fontSize="medium" color="error" />
              </Tooltip>
            )}
          </MaoreFlex>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* 兩位玩家才全秀 */}
        {playerCount === 2 && remainCardCount <= 10 ? (
          renderCards()
        ) : (
          <>
            <Card
              hideCard={true}
              iconSize="small"
              iconColor="#E9C46A"
              bgColor="#E76F51"
              width={50}
            />
            <CloseIcon />
            <Box sx={{ fontSize: '40px', marginLeft: '10px' }}>
              {remainCardCount}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default OtherPlayer;
