import React from 'react';
import { Box, Card as MuiCard, CardActionArea } from '@mui/material';
import CatHand from './icons/CatHand';

type CardProps = {
  id?: string;
  value?: number | React.ReactNode;
  hideCard?: boolean;
  width: string;
  bgColor?: string;
  fontColor?: string;
  symbolSize?: string;
  iconColor?: string;
  iconSize?: 'small' | 'inherit' | 'large' | 'medium' | undefined;
  onSelect?: (id: string) => void;
};

const Card = (props: CardProps) => {
  const {
    id,
    value,
    hideCard = false,
    width,
    bgColor = '#F0F0F0',
    fontColor = '#232220',
    symbolSize = '48px',
    iconColor,
    iconSize = 'medium',
    onSelect,
  } = props;

  return (
    <MuiCard
      sx={{
        width,
        backgroundColor: bgColor,
        aspectRatio: '2/3',
        pointerEvents: hideCard ? 'none' : 'auto',
        color: fontColor,
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
        <Box
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
          <Box sx={{ fontSize: symbolSize, marginBottom: '10px' }}>{value}</Box>
          <CatHand fontSize={iconSize} pathcolor={iconColor} />
        </Box>
      )}
    </MuiCard>
  );
};

export default Card;
