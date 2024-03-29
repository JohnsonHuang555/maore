import { useState } from 'react';
import { Backdrop, Box } from '@mui/material';
import MaoreFlex from '@components/maore/MaoreFlex';
import ControlArea from '../areas/ControllArea';
import RuleModal from '../modals/RuleModal';
import { GamePack } from '@server/domain/Game';

type BasicLayoutProps = {
  showTimer: boolean;
  showYourTurnUI: boolean;
  rules: React.ReactNode;
  children: React.ReactNode;
  timer?: number;
  gamePack: GamePack;
};

const BasicLayout = (props: BasicLayoutProps) => {
  const { showTimer, showYourTurnUI, timer, rules, children, gamePack } = props;
  const [showRuleModal, setShowRuleModal] = useState(false);

  return (
    <MaoreFlex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        position: 'relative',
        background: '#264653',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showYourTurnUI}
      >
        <Box sx={{ fontSize: '40px' }}>輪到你了</Box>
      </Backdrop>
      <RuleModal
        show={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        children={rules}
      />
      {/* 操作區塊 */}
      <ControlArea
        showTimer={showTimer}
        timer={timer}
        gamePack={gamePack}
        onRuleClick={() => setShowRuleModal(true)}
      />
      {children}
    </MaoreFlex>
  );
};

export default BasicLayout;
