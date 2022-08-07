import React from 'react';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

type MaoreFlexProps = {
  children: React.ReactNode;
  verticalHorizonCenter?: boolean;
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  sx?: SxProps;
};

const verticalHorizonStyle: SxProps = {
  alignItems: 'center',
  justifyContent: 'center',
};

const MaoreFlex = (props: MaoreFlexProps) => {
  const { children, verticalHorizonCenter, justifyContent, alignItems, sx } =
    props;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent,
        alignItems,
        ...sx,
        ...(verticalHorizonCenter ? verticalHorizonStyle : {}),
      }}
    >
      {children}
    </Box>
  );
};

export default MaoreFlex;
