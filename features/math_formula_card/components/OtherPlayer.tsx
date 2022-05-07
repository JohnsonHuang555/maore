import { Avatar, Box } from '@mui/material';
import { OthersPlayerInfo } from '../models/OtherPlayerCard';
import Card from './Card';
import CloseIcon from '@mui/icons-material/Close';

type OtherPlayerProps = OthersPlayerInfo;

const OtherPlayer = (props: OtherPlayerProps) => {
  const { remainCardCount, name, point, isNowTurn } = props;
  const renderCards = () => {
    const cards = [];
    for (let i = 0; i < remainCardCount; i++) {
      cards.push(<Card key={i} hideCard={true} size="small" />);
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
          <Box sx={{ fontSize: '24px' }}>{point} 分</Box>
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {remainCardCount <= 5 ? (
          renderCards()
        ) : (
          <>
            <Card hideCard={true} size="small" />
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
