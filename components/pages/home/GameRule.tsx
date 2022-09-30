import { Fragment } from 'react';
import RuleModal from '@components/pages/rooms/modals/RuleModal';
import Rules from '@features/math_formula_card/components/Rules';
import { GamePack } from 'server/domain/Game';

type GameRuleProps = {
  showModal: boolean;
  gamePack: GamePack;
  onClose: () => void;
};

const GameRule = (props: GameRuleProps) => {
  const { showModal, gamePack, onClose } = props;

  const ruleModal: { [key: string]: React.ReactNode } = {
    [GamePack.MathFormulaCard]: (
      <RuleModal show={showModal} onClose={onClose} children={<Rules />} />
    ),
  };

  return <Fragment key={gamePack}>{ruleModal[gamePack]}</Fragment>;
};

export default GameRule;
