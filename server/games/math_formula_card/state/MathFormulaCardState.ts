import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';
import { GameSettingsState } from './GameSettingsState';
import { PlayerInfoState } from './PlayerInfoState';
import { SelectedElementsState } from './SelectedElementsState';

interface IMathFormulaCard {
  answer?: number;
  playerInfos: MapSchema<PlayerInfoState>;
  selectedElements: ArraySchema<SelectedElementsState>;
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

  @type([SelectedElementsState])
  selectedElements = new ArraySchema<SelectedElementsState>();

  @type(GameSettingsState)
  gameSettings = new GameSettingsState();
}
