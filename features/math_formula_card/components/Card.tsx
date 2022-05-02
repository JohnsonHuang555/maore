import React from 'react';
import { Box } from '@mui/material';
import { CardSymbol } from 'server/games/math_formula_card/state/PlayerCardState';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import DivideIcon from '@components/icons/DivideIcon';

// TODO: 之後要做多國
const labelDict: { [key: string]: string } = {
  0: '零',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  [CardSymbol.Plus]: '加',
  [CardSymbol.Minus]: '減',
  [CardSymbol.Times]: '乘',
  [CardSymbol.Divide]: '除',
};

const symbolDict: { [key: string]: React.ReactNode } = {
  [CardSymbol.Plus]: <AddIcon fontSize="large" />,
  [CardSymbol.Minus]: <RemoveIcon fontSize="large" />,
  [CardSymbol.Times]: <ClearIcon fontSize="large" />,
  [CardSymbol.Divide]: <DivideIcon />,
};

type CardProps = {
  size?: 'medium' | 'small';
  cardNumber?: number;
  cardSymbol?: CardSymbol;
  hideCard?: boolean;
};

const Card = (props: CardProps) => {
  const { cardNumber, cardSymbol, hideCard = false, size = 'medium' } = props;

  const getLabel = () => {
    if (cardNumber) {
      return cardNumber;
    } else if (cardSymbol) {
      return symbolDict[cardSymbol];
    } else {
      return null;
    }
  };

  const getBrief = () => {
    if (cardNumber) {
      return labelDict[cardNumber];
    } else if (cardSymbol) {
      return labelDict[cardSymbol];
    } else {
      return null;
    }
  };

  const getSize = () => {
    let width = '140px';
    let height = '220px';
    if (size === 'small') {
      width = '90px';
      height = '130px';
    }
    return {
      width,
      height,
    };
  };

  return (
    <Box
      sx={{
        width: getSize().width,
        height: getSize().height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'black',
        margin: '0 10px',
      }}
    >
      {hideCard ? (
        <Box sx={{ backgroundColor: 'black' }} />
      ) : (
        <>
          <Box sx={{ fontSize: '50px', marginBottom: '10px' }}>
            {getLabel()}
          </Box>
          <Box>{getBrief()}</Box>
        </>
      )}
    </Box>
  );
};

export default Card;
