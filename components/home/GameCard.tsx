import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { Game } from 'models/Game';

type GameCardProp = {
  game: Game;
};

const GameCard = (props: GameCardProp) => {
  const { game } = props;

  return (
    <Card>
      <CardActionArea>
        <CardMedia component="img" height="400" image={game.imgPath} />
      </CardActionArea>
    </Card>
  );
};

export default GameCard;
