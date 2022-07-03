import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ClearIcon from '@mui/icons-material/Clear';
import DivideIcon from 'features/math_formula_card/components/icons/DivideIcon';

const SymbolDropZone = () => {
  return (
    <Box
      sx={{
        aspectRatio: '2/3',
        width: '80px',
        display: 'grid',
        border: '2px dashed',
        borderRadius: '5px',
        backgroundColor: '#3B6070',
      }}
    >
      <AddIcon
        fontSize="medium"
        sx={{
          gridColumn: 1,
          gridRow: 1,
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      />
      <RemoveIcon
        fontSize="medium"
        sx={{
          gridColumn: 2,
          gridRow: 1,
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      />
      <ClearIcon
        fontSize="medium"
        sx={{
          gridColumn: 1,
          gridRow: 2,
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      />
      <DivideIcon
        fontSize="small"
        sx={{
          gridColumn: 2,
          gridRow: 2,
          alignSelf: 'center',
          justifySelf: 'center',
        }}
      />
    </Box>
  );
};

export default SymbolDropZone;
