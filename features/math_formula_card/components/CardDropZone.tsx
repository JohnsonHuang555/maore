import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';
import { ItemType } from '../models/ItemType';
import HandCard from './HandCard';

type CardDropZoneProps = {
  id: string;
  cardId?: string;
  cardNumber?: number;
  mathSymbol?: MathSymbol;
};

const CardDropZone = (props: CardDropZoneProps) => {
  const { id, cardId, cardNumber, mathSymbol } = props;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemType.Card,
      drop: () => ({ id }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [id]
  );

  return (
    <Box
      ref={drop}
      sx={{
        aspectRatio: '2/3',
        width: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed',
        borderRadius: '5px',
        backgroundColor: isOver ? '#4c636d' : '#415761',
        textAlign: 'center',
      }}
    >
      {cardNumber && cardId && (
        <Box sx={{ fontSize: '16px' }}>
          <HandCard card={{ id: cardId, cardNumber }} onDropCard={() => {}} />
        </Box>
      )}
      {cardNumber === undefined && mathSymbol === undefined && (
        <Box sx={{ color: '#ccc', fontSize: '16px', margin: '10px' }}>
          將牌拖曳到這裡
        </Box>
      )}
    </Box>
  );
};

export default CardDropZone;
