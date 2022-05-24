import React from 'react';
import { Box, Paper } from '@mui/material';

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

// const symbolDict: { [key: string]: React.ReactNode } = {
//   [CardSymbol.Plus]: <AddIcon fontSize="large" />,
//   [CardSymbol.Minus]: <RemoveIcon fontSize="large" />,
//   [CardSymbol.Times]: <ClearIcon fontSize="large" />,
//   [CardSymbol.Divide]: <DivideIcon />,
//   [CardSymbol.Parentheses]: '()',
// };

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
        padding: '20px',
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
        <>
          <Box sx={{ fontSize: '50px', marginBottom: '10px' }}>{value}</Box>
          <Box>{labelDict[value as number]}</Box>
        </>
      )}
    </Paper>
  );
};

export default Card;
