import React from 'react';
import { Box, Card as MuiCard, CardActionArea } from '@mui/material';
import CatHand from './icons/CatHand';

// TODO: 之後要做多國
const labelDict: { [key: string]: string } = {
  '0': '零',
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '7': '七',
  '8': '八',
  '9': '九',
};

type CardProps = {
  id?: string;
  value?: number;
  hideCard?: boolean;
  width: string;
  onSelect?: (id: string) => void;
};

const Card = (props: CardProps) => {
  const { id, value, hideCard = false, width, onSelect } = props;

  return (
    <MuiCard
      sx={{
        width,
        backgroundColor: '#F0F0F0',
        aspectRatio: '2/3',
        pointerEvents: hideCard ? 'none' : 'auto',
        color: '#232220',
      }}
      onClick={() => {
        if (id && onSelect) {
          onSelect(id);
        }
      }}
    >
      {hideCard ? (
        <Box />
      ) : (
        <CardActionArea
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '35px 0',
          }}
        >
          <Box sx={{ fontSize: '48px', marginBottom: '10px' }}>{value}</Box>
          <CatHand fontSize="medium" />
        </CardActionArea>
      )}
    </MuiCard>
  );
};

export default Card;
