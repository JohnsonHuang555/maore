import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CardActionArea, CardMedia } from '@material-ui/core';
import { Game } from 'domain/models/Game';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
});

type GameCardProp = {
  game: Game;
};

const GameCard = (props: GameCardProp) => {
  const { game } = props;
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={game.homeImg}
          title={game.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {game.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {game.breif}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GameCard;
