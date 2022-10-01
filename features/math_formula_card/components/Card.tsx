import React from 'react';
import { Box, Card as MuiCard } from '@mui/material';
import CatHand from '../../../components/icons/CatHand';

type CardProps = {
  id?: string;
  value?: number | React.ReactNode;
  hideCard?: boolean;
  width: number;
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
        minWidth: {
          xs: `${width * 0.7}px`,
          sm: `${width * 0.8}px`,
          lg: `${width}px`,
        },
        height: {
          xs: `${(width * 0.7 * 3) / 2}px`,
          sm: `${(width * 0.8 * 3) / 2}px`,
          lg: `${(width * 3) / 2}px`,
        },
        backgroundColor: bgColor,
        pointerEvents: hideCard ? 'none' : 'auto',
        color: fontColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: hideCard ? '2px solid #E9C46A' : '',
      }}
      onClick={() => {
        if (id && onSelect) {
          onSelect(id);
        }
      }}
    >
      {hideCard ? (
        <Box>
          <CatHand fontSize={iconSize} pathcolor={iconColor} />
        </Box>
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
          <Box
            sx={{
              fontSize: {
                xs: '30px',
                sm: '32px',
                md: '40px',
                lg: symbolSize,
              },
              marginBottom: '10px',
            }}
          >
            {value}
          </Box>
          <CatHand fontSize={iconSize} pathcolor={iconColor} />
        </Box>
      )}
    </MuiCard>
  );
};

export default Card;
