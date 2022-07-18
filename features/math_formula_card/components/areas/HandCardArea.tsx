import { Box } from '@mui/material';
import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import Card from '../Card';
import { useDrag } from 'react-dnd';
import { ItemType } from 'features/math_formula_card/models/ItemType';

type HandCardAreaProps = {
  card: IPlayerCard;
  onDropCard: (id: string, targetId: string) => void;
};

interface DropResult {
  id: string;
}

const HandCardArea = (props: HandCardAreaProps) => {
  const { card, onDropCard } = props;
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.Card,
    item: { id: card.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        onDropCard(item.id, dropResult.id);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <Box ref={dragRef} sx={{ opacity }}>
      <Card key={card.id} id={card.id} value={card.cardNumber} width="100px" />
    </Box>
  );
};

export default HandCardArea;
