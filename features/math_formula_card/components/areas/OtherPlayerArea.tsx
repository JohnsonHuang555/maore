import { Box } from '@mui/material';
import { OthersPlayerInfo } from 'features/math_formula_card/models/OtherPlayerCard';
import OtherPlayer from '../OtherPlayer';

type OtherPlayerAreaProp = {
  playerId: string;
  playerInfo: OthersPlayerInfo;
};

const OtherPlayerArea = (props: OtherPlayerAreaProp) => {
  const { playerId, playerInfo } = props;
  const { remainCardCount, name, point, isNowTurn } = playerInfo;

  return (
    <Box sx={{ flex: 1 }} key={playerId}>
      <OtherPlayer
        playerCount={1} // FIXME:
        remainCardCount={remainCardCount}
        name={name}
        point={point}
        isNowTurn={isNowTurn}
      />
    </Box>
  );
};

export default OtherPlayerArea;
