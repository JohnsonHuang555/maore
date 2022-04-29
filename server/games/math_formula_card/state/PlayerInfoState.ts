import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerCardState } from './PlayerCardState';

export interface IPlayerInfo {
  cards: ArraySchema<PlayerCardState>;
}

export class PlayerInfoState extends Schema implements IPlayerInfo {
  @type([PlayerCardState])
  cards: ArraySchema<PlayerCardState>;

  constructor({ cards }: IPlayerInfo) {
    super();
    this.cards = cards;
  }
}
