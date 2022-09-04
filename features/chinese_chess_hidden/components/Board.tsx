import { useMemo } from 'react';
import { Box } from '@mui/material';
import { ChessInfo } from '../models/ChineseChessState';
import MaoreFlex from '@components/maore/MaoreFlex';

type BoardProps = {
  chesses: ChessInfo[];
};

const Board = (props: BoardProps) => {
  const { chesses } = props;

  // 為了避免作弊所以要亂數排序
  const shuffledChesses = useMemo(() => {
    return [...chesses].sort(() => Math.random() - 0.5);
  }, [chesses]);

  return (
    <Box
      sx={{ width: '80vw', height: 'calc(80vw / 2.5)' }}
      display="grid"
      gridTemplateColumns="repeat(8, 1fr)"
    >
      {shuffledChesses.map((chessInfo) => (
        <Box
          sx={{
            border: '1px solid gray',
            margin: '0 -1px -1px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={chessInfo.id}
          gridColumn={chessInfo.locationX + 1}
          gridRow={chessInfo.locationY + 1}
        >
          <MaoreFlex
            verticalHorizonCenter
            sx={{
              width: '60%',
              height: '75%',
              border: '1px solid',
              borderRadius: '50%',
              fontFamily: 'cursive',
              fontSize: {
                md: '44px',
              },
            }}
          >
            <Box>{chessInfo.name}</Box>
          </MaoreFlex>
        </Box>
      ))}
    </Box>
  );
};

export default Board;
