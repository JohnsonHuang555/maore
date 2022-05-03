import React from 'react';
import { Box, Paper } from '@mui/material';
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
  value?: number | CardSymbol;
  hideCard?: boolean;
  onSelect: (val: number | CardSymbol) => void;
};

const Card = (props: CardProps) => {
  const { value, hideCard = false, size = 'medium', onSelect } = props;

  if (!value) {
    return null;
  }

  const getLabel = () => {
    if (!isNaN(value as number)) {
      return value;
    }
    return symbolDict[value];
  };

  const getBrief = () => {
    return labelDict[value];
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
    <Paper
      elevation={4}
      sx={{
        width: getSize().width,
        height: getSize().height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#1d1d1d',
        margin: '0 10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        pointerEvents: hideCard ? 'none' : 'auto',
        ':hover': {
          backgroundColor: 'rgba(0,0,0,0.25)',
        },
      }}
      onClick={() => onSelect(value)}
    >
      {hideCard ? (
        <Box />
      ) : (
        <>
          <Box sx={{ fontSize: '50px', marginBottom: '10px' }}>
            {getLabel()}
          </Box>
          <Box>{getBrief()}</Box>
        </>
      )}
    </Paper>
  );
};

export default Card;
