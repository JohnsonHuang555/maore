import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';
import { ItemType } from '../models/ItemType';
import HandCard from './HandCard';
import MathSymbolCard from './MathSymbolCard';
import { selectedCardSymbolDict } from './SelectedCardDict';

type CardDropZoneProps = {
  id: string;
  cardId?: string;
  cardNumber?: number;
  mathSymbol?: MathSymbol | '';
  onDropCard: (id: string, targetId: string) => void;
};

const CardDropZone = (props: CardDropZoneProps) => {
  const { id, cardId, cardNumber, mathSymbol, onDropCard } = props;

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
        width: {
          xs: '70px',
          sm: '80px',
          lg: '100px',
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed',
        borderRadius: '5px',
        backgroundColor: isOver ? '#4c636d' : '#415761',
        textAlign: 'center',
      }}
    >
      {cardNumber !== undefined && cardNumber !== -1 && cardId && (
        <Box sx={{ fontSize: '16px' }}>
          <HandCard card={{ id: cardId, cardNumber }} onDropCard={onDropCard} />
        </Box>
      )}
      {mathSymbol && cardId && (
        <Box sx={{ fontSize: '16px' }}>
          <MathSymbolCard
            id={cardId}
            symbolKey={mathSymbol}
            symbolValue={selectedCardSymbolDict[mathSymbol]}
            onDropCard={onDropCard}
          />
        </Box>
      )}
      {(cardNumber === undefined || cardNumber === -1) &&
        (mathSymbol === undefined || mathSymbol === '') && (
          <Box
            sx={{
              color: '#ccc',
              fontSize: {
                xs: '12px',
                sm: '14px',
                lg: '16px',
              },
              margin: '10px',
            }}
          >
            將牌拖曳到這裡
          </Box>
        )}
    </Box>
  );
};

export default CardDropZone;
