import { Box } from '@mui/material';
import Card from './Card';
import { useDrag } from 'react-dnd';
import { ItemType } from 'features/math_formula_card/models/ItemType';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

type MathSymbolCardProps = {
  id: string;
  symbolKey: MathSymbol;
  symbolValue: React.ReactNode;
  onDropCard: (id: string, targetId: string, mathSymbol: MathSymbol) => void;
};

interface DropResult {
  id: string;
}

const MathSymbolCard = (props: MathSymbolCardProps) => {
  const { id, symbolKey, symbolValue, onDropCard } = props;

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.Card,
    item: { id: id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        // drop 後產一個 新的 id
        onDropCard(item.id, dropResult.id, symbolKey);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <Box ref={dragRef} sx={{ opacity }}>
      <Card value={symbolValue} width="100px" />
    </Box>
  );
};

export default MathSymbolCard;
