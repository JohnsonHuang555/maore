import { Schema, ArraySchema, type } from '@colyseus/schema';
import { PlayerCardState } from './PlayerCardState';

export interface IPlayerInfo {
  point: number;
  cards: ArraySchema<PlayerCardState>;
}

export class PlayerInfoState extends Schema implements IPlayerInfo {
  @type('number')
  point: number;

  @type([PlayerCardState])
  cards: ArraySchema<PlayerCardState>;

  constructor({ point, cards }: IPlayerInfo) {
    super();
    this.point = point;
    this.cards = cards;
  }
}
