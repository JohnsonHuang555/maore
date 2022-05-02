import { Box } from '@mui/material';
import { CardSymbol } from 'server/games/math_formula_card/state/PlayerCardState';

// TODO: 之後要做多國
const labelDictionary: { [key: string]: string } = {
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

type CardProps = {
  value?: number | CardSymbol;
};

const Card = (props: CardProps) => {
  const { value } = props;
  if (!value) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '130px',
        height: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'black',
        margin: '0 10px',
      }}
    >
      <Box sx={{ fontSize: '50px', marginBottom: '10px' }}>{value}</Box>
      <div>{labelDictionary[value]}</div>
    </Box>
  );
};

export default Card;
