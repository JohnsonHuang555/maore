import Box from '@mui/material/Box';
import { Player } from 'models/Player';
import React from 'react';
import PlayerList from './PlayerCard';

type PlayerAreaProps = {
  players: Player[];
  yourPlayerId: string;
};

const PlayerArea = (props: PlayerAreaProps) => {
  const { players, yourPlayerId } = props;
  return (
    <Box>
      <Box>
        <PlayerList players={players} yourPlayerId={yourPlayerId} />
      </Box>
    </Box>
  );
};

export default PlayerArea;
