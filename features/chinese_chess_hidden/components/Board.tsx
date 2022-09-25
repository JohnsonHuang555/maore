import { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { IChessInfo } from '@server/games/chinese_chess_hidden/state/ChessInfoState';
import { motion } from 'framer-motion';
import { ChessSide } from '../models/ChineseChessSide';
import { useSnackbar } from 'notistack';

type BoardProps = {
  chesses: IChessInfo[];
  selectedChess?: IChessInfo;
  isYourTurn: boolean;
  yourSide: ChessSide | '';
  flipChess: (id: string) => void;
  selectChess: (chess: IChessInfo) => void;
  moveChess: (targetX: number, targetY: number) => void;
  eatChess: (id: string) => void;
};

const chessVariant = {
  selected: {
    rotateY: 180,
    transition: { duration: 0.35 },
    // zIndex: 10,
    // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
  },
};

const diagonalLinesLeftToRight = [
  {
    x: 3,
    y: 2,
  },
  {
    x: 4,
    y: 3,
  },
];

const diagonalLinesRightToLeft = [
  {
    x: 4,
    y: 2,
  },
  {
    x: 3,
    y: 3,
  },
];

const Board = (props: BoardProps) => {
  const {
    chesses,
    selectedChess,
    isYourTurn,
    yourSide,
    flipChess,
    selectChess,
    moveChess,
    eatChess,
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  // 為了避免作弊所以要亂數排序
  // const shuffledChesses = useMemo(() => {
  //   return [...chesses].sort(() => Math.random() - 0.5);
  // }, [chesses]);

  const handleClickChess = (e: any, chessInfo: IChessInfo) => {
    e.stopPropagation();
    if (!isYourTurn) {
      enqueueSnackbar('還沒輪到你', { variant: 'warning' });
      return;
    }

    if (
      chessInfo.isFlipped &&
      selectedChess !== undefined &&
      chessInfo.chessSide !== yourSide
    ) {
      console.log('eat??');
      eatChess(chessInfo.id);
      return;
    }

    if (!chessInfo.isFlipped) {
      flipChess(chessInfo.id);
    } else {
      if (chessInfo.chessSide !== yourSide) {
        enqueueSnackbar('請選擇自己陣營的棋子', { variant: 'warning' });
        return;
      }

      console.log('select');
      selectChess(chessInfo);
    }
  };

  const handleMoveChess = (index: number) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    if (!isYourTurn || !selectedChess) {
      return;
    }

    moveChess(x, y);
  };

  if (!chesses.length) return <div>建立棋盤中...</div>;

  const getChess = (index: number) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    const chess = chesses.find(
      (c) => c.alive && c.locationX === x && c.locationY === y
    );

    if (!chess) return null;

    return (
      <motion.div
        style={{
          width: '64%',
          height: '70%',
          fontFamily: 'cursive',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          border: chess.isFlipped ? 'none' : '2px solid',
          position: 'absolute',
          backgroundColor: chess.isFlipped ? 'white' : '#619159',
          cursor: 'pointer',
        }}
        initial={{ opacity: 1 }}
        onClick={(e) => handleClickChess(e, chess)}
        // animate={{ opacity: 1, scale: 1 }}
        // transition={{
        //   duration: 0.8,
        //   delay: 0.5,
        //   ease: [0, 0.71, 0.2, 1.01],
        // }}
      >
        {chess.isFlipped ? (
          <Box
            sx={{
              fontSize: { sm: '24px', md: '40px', lg: '80px' },
              width: '90%',
              height: '90%',
              border: `2px solid ${
                chess.chessSide === ChessSide.Black ? 'black' : 'red'
              }`,
              borderRadius: '50%',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: chess.chessSide === ChessSide.Black ? 'black' : 'red',
            }}
          >
            {chess.name}
          </Box>
        ) : null}
      </motion.div>
    );
  };

  return (
    <Box
      sx={{
        width: '70vw',
        height: 'calc(80vw / 2.5)',
        border: '2px solid #161515',
        backgroundColor: '#B07736',
      }}
      display="grid"
      gridTemplateColumns="repeat(8, 1fr)"
    >
      {Array.from({ length: 32 }).map((_n, i) => (
        <Box
          key={i}
          sx={{
            border: '1px solid #161515',
            margin: '0 -1px -1px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
          onClick={() => handleMoveChess(i)}
        >
          {(i === 19 || i === 28) && (
            <Box
              sx={{
                position: 'absolute',
                width: '135%',
                border: '1px solid #565353',
                transform: 'rotate(42deg)',
                zIndex: 0,
              }}
            />
          )}
          {(i === 20 || i === 27) && (
            <Box
              sx={{
                position: 'absolute',
                width: '135%',
                border: '1px solid #565353',
                transform: 'rotate(-42deg)',
                zIndex: 0,
              }}
            />
          )}
          {getChess(i)}
        </Box>
      ))}
    </Box>
  );
};

export default Board;
