import { Box } from '@mui/material';
import { OthersPlayerInfo } from 'features/math_formula_card/models/OtherPlayerCard';
import OtherPlayer from '../OtherPlayer';

type OtherPlayerAreaProp = {
  playerId: string;
  playerInfo: OthersPlayerInfo;
  playerCount: number;
};

const OtherPlayerArea = (props: OtherPlayerAreaProp) => {
  const { playerId, playerInfo, playerCount } = props;
  const { remainCardCount, name, point, isNowTurn } = playerInfo;

  return (
    <Box sx={{ flex: 1 }} key={playerId}>
      <OtherPlayer
        playerCount={playerCount} // FIXME:
        remainCardCount={remainCardCount}
        name={name}
        point={point}
        isNowTurn={isNowTurn}
      />
    </Box>
  );
};

export default OtherPlayerArea;
