import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import { ItemType } from '../models/ItemType';

type NumberDropZoneProps = {
  id: string;
};

const NumberDropZone = (props: NumberDropZoneProps) => {
  const { id } = props;

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
        padding: '10px',
      }}
    >
      <Box sx={{ color: '#ccc', fontSize: '16px' }}>將牌拖曳到這裡</Box>
    </Box>
  );
};

export default NumberDropZone;
