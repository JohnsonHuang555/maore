import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Game } from 'domain/models/Game';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Button, CardActions } from '@mui/material';

type GameCardProp = {
  game: Game;
  onSelectGame: () => void;
};

const GameCard = (props: GameCardProp) => {
  const { game, onSelectGame } = props;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="name">
            J
          </Avatar>
        }
        title={game.name}
        subheader={game.createAt}
      />
      <CardMedia
        component="img"
        height="194"
        image={game.imageUrl}
        alt={game.name}
      />
      <CardContent>
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
