import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import { GameSettingsState } from './GameSettingsState';
import { PlayerInfoState } from './PlayerInfoState';
import { SelectedCardState } from './SelectedCardState';

interface IMathFormulaCard {
  answer?: number;
  playerInfos: MapSchema<PlayerInfoState>;
  selectedCards: ArraySchema<SelectedCardState>;
  gameSettings: GameSettingsState;
}

export default class MathFormulaCardState
  extends Schema
  implements IMathFormulaCard
{
  @type('number')
  answer?: number;

  @type({ map: PlayerInfoState })
  playerInfos = new MapSchema<PlayerInfoState>();

  @type([SelectedCardState])
  selectedCards = new ArraySchema<SelectedCardState>();

  @type(GameSettingsState)
  gameSettings = new GameSettingsState();
}
