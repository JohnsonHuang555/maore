import { Box } from '@mui/material';

const NumberDropZone = () => {
  return (
    <Box
      sx={{
        aspectRatio: '1/1',
        height: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed',
        borderRadius: '5px',
        backgroundColor: '#415761',
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: '#ccc' }}>
        0 ~ 9<br />
        可多張
      </Box>
    </Box>
  );
};

export default NumberDropZone;
