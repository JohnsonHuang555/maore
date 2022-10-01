import { useState } from 'react';
import { Box } from '@mui/material';
import { IChessInfo } from '@server/games/chinese_chess_hidden/state/ChessInfoState';
import { motion } from 'framer-motion';
import { ChessSide } from '../models/ChineseChessSide';
import { useSnackbar } from 'notistack';
import CatHand from '@components/icons/CatHand';

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
  const [hoverCell, setHoverCell] = useState<number>();
  const [nowSelectedIndex, setNowSelectedIndex] = useState<number>();

  // 為了避免作弊所以要亂數排序
  // const shuffledChesses = useMemo(() => {
  //   return [...chesses].sort(() => Math.random() - 0.5);
  // }, [chesses]);

  const handleClickChess = (e: any, chessInfo: IChessInfo, index: number) => {
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
      setNowSelectedIndex(undefined);
      return;
    }

    if (!chessInfo.isFlipped) {
      flipChess(chessInfo.id);
      setNowSelectedIndex(undefined);
    } else {
      if (chessInfo.chessSide !== yourSide) {
        enqueueSnackbar('請選擇自己陣營的棋子', { variant: 'warning' });
        return;
      }

      console.log('select');
      selectChess(chessInfo);
      setNowSelectedIndex(index);
    }
  };

  const handleMoveChess = (index: number) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    if (!isYourTurn || !selectedChess) {
      return;
    }

    moveChess(x, y);
    setNowSelectedIndex(undefined);
  };

  const handleHoverCell = (index: number) => {
    setHoverCell(index);
  };

  const handleNotHoverCell = () => {
    setHoverCell(undefined);
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
        initial={{ opacity: 0, rotateX: chess.isFlipped ? 180 : 0 }}
        animate={{
          opacity: 1,
          rotateX: chess.isFlipped ? 180 : 0,
        }}
        whileHover={{
          scale: !chess.isFlipped ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        onClick={(e) => handleClickChess(e, chess, index)}
      >
        {chess.isFlipped ? (
          <motion.div
            style={{
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
            initial={{ rotateX: 180 }}
            transition={{ delay: 1 }}
          >
            {chess.name}
          </motion.div>
        ) : null}
      </motion.div>
    );
  };

  const renderBorder = (i: number) => {
    return (
      <>
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
        {[0, 2, 4, 6, 9, 15].includes(i) && (
          <Box
            sx={{
              width: '20%',
              height: '20%',
              left: '5px',
              bottom: '5px',
              border: '2px solid #565353',
              borderRight: 'none',
              borderTop: 'none',
              position: 'absolute',
              zIndex: 0,
            }}
          />
        )}
        {[1, 3, 5, 7, 8, 14].includes(i) && (
          <Box
            sx={{
              width: '20%',
              height: '20%',
              right: '5px',
              bottom: '5px',
              border: '2px solid #565353',
              borderTop: 'none',
              borderLeft: 'none',
              position: 'absolute',
            }}
          />
        )}
        {[8, 10, 12, 14, 17, 23].includes(i) && (
          <Box
            sx={{
              width: '20%',
              height: '20%',
              left: '5px',
              top: '5px',
              border: '2px solid #565353',
              borderRight: 'none',
              borderBottom: 'none',
              position: 'absolute',
              zIndex: 0,
            }}
          />
        )}
        {[9, 11, 13, 15, 16, 22].includes(i) && (
          <Box
            sx={{
              width: '20%',
              height: '20%',
              right: '5px',
              top: '5px',
              border: '2px solid #565353',
              borderLeft: 'none',
              borderBottom: 'none',
              position: 'absolute',
            }}
          />
        )}
      </>
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
            fontSize: { sm: '24px', md: '40px', lg: '80px' },
          }}
          onClick={() => handleMoveChess(i)}
          onMouseEnter={() => handleHoverCell(i)}
          onMouseLeave={() => handleNotHoverCell()}
        >
          <motion.div
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: hoverCell === i || nowSelectedIndex === i ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <Box
              sx={{
                width: '20%',
                height: '20%',
                left: '5px',
                top: '5px',
                border: `5px solid ${nowSelectedIndex === i ? '#c93434' : ''}`,
                borderRight: 'none',
                borderBottom: 'none',
                position: 'absolute',
              }}
            />
            <Box
              sx={{
                width: '20%',
                height: '20%',
                right: '5px',
                top: '5px',
                border: `5px solid ${nowSelectedIndex === i ? '#c93434' : ''}`,
                borderLeft: 'none',
                borderBottom: 'none',
                position: 'absolute',
              }}
            />
            <Box
              sx={{
                width: '20%',
                height: '20%',
                left: '5px',
                bottom: '5px',
                border: `5px solid ${nowSelectedIndex === i ? '#c93434' : ''}`,
                borderRight: 'none',
                borderTop: 'none',
                position: 'absolute',
              }}
            />
            <Box
              sx={{
                width: '20%',
                height: '20%',
                right: '5px',
                bottom: '5px',
                border: `5px solid ${nowSelectedIndex === i ? '#c93434' : ''}`,
                borderTop: 'none',
                borderLeft: 'none',
                position: 'absolute',
              }}
            />
          </motion.div>
          {renderBorder(i)}
          {getChess(i)}
        </Box>
      ))}
    </Box>
  );
};

export default Board;
