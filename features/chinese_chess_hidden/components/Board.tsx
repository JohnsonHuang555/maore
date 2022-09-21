import { useMemo } from 'react';
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
  const shuffledChesses = useMemo(() => {
    return [...chesses].sort(() => Math.random() - 0.5);
  }, [chesses]);

  const handleClickChess = (e: any, chessInfo: IChessInfo) => {
    e.stopPropagation();
    if (!isYourTurn) {
      enqueueSnackbar('還沒輪到你', { variant: 'warning' });
      return;
    }

    if (selectedChess !== undefined && selectedChess.chessSide !== yourSide) {
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

  const handleMoveChess = (locationX: number, locationY: number) => {
    if (!isYourTurn || !selectedChess) {
      return;
    }

    console.log('move');

    moveChess(locationX, locationY);
  };

  if (!chesses.length) return <div>建立棋盤中...</div>;

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
      {shuffledChesses.map((chessInfo) => (
        <Box
          sx={{
            border: '1px solid #161515',
            margin: '0 -1px -1px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
          key={chessInfo.id}
          gridColumn={chessInfo.locationX + 1}
          gridRow={chessInfo.locationY + 1}
          onClick={() =>
            handleMoveChess(chessInfo.locationX, chessInfo.locationY)
          }
        >
          {!!diagonalLinesLeftToRight.find(
            ({ x, y }) => x === chessInfo.locationX && y === chessInfo.locationY
          ) && (
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
          {!!diagonalLinesRightToLeft.find(
            ({ x, y }) => x === chessInfo.locationX && y === chessInfo.locationY
          ) && (
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
              border: chessInfo.isFlipped ? 'none' : '2px solid',
              position: 'absolute',
              backgroundColor: chessInfo.isFlipped ? 'white' : '#619159',
              cursor: 'pointer',
            }}
            initial={{ opacity: 1 }}
            onClick={(e) => handleClickChess(e, chessInfo)}
            // animate={{ opacity: 1, scale: 1 }}
            // transition={{
            //   duration: 0.8,
            //   delay: 0.5,
            //   ease: [0, 0.71, 0.2, 1.01],
            // }}
          >
            {chessInfo.isFlipped ? (
              <Box
                sx={{
                  fontSize: { sm: '24px', md: '40px', lg: '80px' },
                  width: '90%',
                  height: '90%',
                  border: `2px solid ${
                    chessInfo.chessSide === ChessSide.Black ? 'black' : 'red'
                  }`,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color:
                    chessInfo.chessSide === ChessSide.Black ? 'black' : 'red',
                }}
              >
                {chessInfo.name}
              </Box>
            ) : null}
          </motion.div>
        </Box>
      ))}
    </Box>
  );
};

export default Board;
