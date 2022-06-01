import React from 'react';
import { Box, Card as MuiCard, CardActionArea } from '@mui/material';

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
  height: string;
  onSelect?: (id: string) => void;
};

const Card = (props: CardProps) => {
  const { id, value, hideCard = false, width, height, onSelect } = props;

  return (
    <MuiCard
      sx={{
        width,
        height,
        backgroundColor: '#1d1d1d',
        pointerEvents: hideCard ? 'none' : 'auto',
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
          <Box sx={{ fontSize: '50px', marginBottom: '10px' }}>{value}</Box>
          <Box>{labelDict[value as number]}</Box>
        </CardActionArea>
      )}
    </MuiCard>
  );
};

export default Card;
