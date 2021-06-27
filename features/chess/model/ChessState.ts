import { Chess } from "features/chess/model/Chess";
import { ArraySchema } from '@colyseus/schema';

export interface ChessState {
  chesses: ArraySchema<Chess>;
}
