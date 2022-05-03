import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Game } from '@domain/models/Game';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActions } from '@mui/material';

type GameCardProp = {
  game: Game;
  onSelectGame: () => void;
};

const GameCard = (props: GameCardProp) => {
  const { game, onSelectGame } = props;

  return (
    <Card>
      <CardMedia
        component="img"
        height="194"
        image={game.imageUrl}
        alt={game.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {game.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="large" color="secondary" onClick={onSelectGame}>
          Play
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
