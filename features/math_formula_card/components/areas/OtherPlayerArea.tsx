import { Box } from '@mui/material';
import { activePlayerSelector, playersSelector } from '@selectors/roomSelector';
import { OthersPlayerInfo } from 'features/math_formula_card/models/OtherPlayerCard';
import { useSelector } from 'react-redux';
import OtherPlayer from '../OtherPlayer';

type OtherPlayerAreaProp = {
  playerId: string;
  playerInfo: OthersPlayerInfo;
  playerCount: number;
};

const OtherPlayerArea = (props: OtherPlayerAreaProp) => {
  const { playerId, playerInfo, playerCount } = props;
  const { remainCardCount, name, point } = playerInfo;
  const activePlayer = useSelector(activePlayerSelector);
  const players = useSelector(playersSelector);

  const getIsNowTurn = () => {
    const player = players.find((p) => p.id === playerId);
    if (player?.playerIndex === activePlayer) {
      return true;
    }
    return false;
  };

  return (
    <Box sx={{ flex: 1, marginTop: { xs: '50px', sm: '10px' } }}>
      <OtherPlayer
        playerCount={playerCount} // FIXME:
        remainCardCount={remainCardCount}
        name={name}
        point={point}
        isNowTurn={getIsNowTurn()}
      />
    </Box>
  );
};

export default OtherPlayerArea;
