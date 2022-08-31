import Image from 'next/image';
import Card from '@mui/material/Card';
import { Game } from '@domain/models/Game';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActions } from '@mui/material';

type GameCardProp = {
  game: Game;
  onSelectGame: () => void;
};

const GameCard = (props: GameCardProp) => {
  const { game, onSelectGame } = props;

  return (
    <Card sx={{ bgcolor: '#2a434f' }} variant="outlined">
      {/* <CardMedia
        component="img"
        sx={{
          height: {
            xs: '150px',
            sm: 'auto',
            lg: '194px',
          },
        }}
        image={`${game.imageUrl}/home.jpg`}
        alt={game.name}
      /> */}
      <Box
        sx={{
          height: {
            xs: '150px',
            sm: 'auto',
            lg: '194px',
          },
          width: '100%',
          position: 'relative',
        }}
      >
        <Image
          alt={game.name}
          src={`${game.imageUrl}/home.jpg`}
          layout="fill"
          objectFit="cover"
        />
      </Box>
      <CardContent>
        <Typography
          gutterBottom
          sx={{
            fontSize: {
              xs: '22px',
              sm: '24px',
              lg: '26px',
            },
          }}
          component="div"
        >
          {game.name}
        </Typography>
        <Typography
          sx={{
            fontSize: {
              xs: '16px',
              sm: '18px',
              lg: '20px',
            },
          }}
          color="text.secondary"
        >
          {game.brief}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="secondary"
          variant="contained"
          disableElevation
          sx={{ flex: 0.3 }}
          onClick={onSelectGame}
        >
          Play
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
