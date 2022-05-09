import React from 'react';
import { Box, Paper } from '@mui/material';
import { CardSymbol } from 'server/games/math_formula_card/state/PlayerCardState';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import DivideIcon from '@components/icons/DivideIcon';

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
  id?: string;
  value?: number | CardSymbol;
  hideCard?: boolean;
  width: string;
  height: string;
  onSelect?: (id: string, val: number | CardSymbol) => void;
};

const Card = (props: CardProps) => {
  const { id, value, hideCard = false, width, height, onSelect } = props;

  const getBrief = () => {
    return labelDict[value as number | CardSymbol];
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#1d1d1d',
        cursor: 'pointer',
        transition: 'all 0.2s',
        pointerEvents: hideCard ? 'none' : 'auto',
        ':hover': {
          backgroundColor: 'rgba(0,0,0,0.25)',
        },
      }}
      onClick={() => {
        if (id && onSelect && value !== undefined) {
          onSelect(id, value);
        }
      }}
    >
      {hideCard ? (
        <Box />
      ) : (
        <>
          <Box sx={{ fontSize: '50px', marginBottom: '10px' }}>
            {Card.getLabel(value as number | CardSymbol)}
          </Box>
          <Box>{getBrief()}</Box>
        </>
      )}
    </Paper>
  );
};

// 開給外面 function call
Card.getLabel = (value: number | CardSymbol) => {
  if (!isNaN(value as number)) {
    return value;
  }
  return symbolDict[value];
};

export default Card;
