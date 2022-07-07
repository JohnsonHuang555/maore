import { Box } from '@mui/material';
import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import Card from '../Card';
import { useDrag } from 'react-dnd';
import { ItemType } from 'features/math_formula_card/models/ItemType';

// TODO: 每張牌有自己的 座標位置
type HandCardAreaProps = {
  card: IPlayerCard;
  onSelect: (id: string) => void;
};

const HandCardArea = (props: HandCardAreaProps) => {
  const { card, onSelect } = props;
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.Card,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  if (isDragging) {
    console.log(card.cardNumber, 'card');
  }

  return (
    <Box ref={dragRef}>
      <Card
        key={card.id}
        id={card.id}
        value={card.cardNumber}
        width="100px"
        onSelect={onSelect}
      />
    </Box>
  );
};

export default HandCardArea;
