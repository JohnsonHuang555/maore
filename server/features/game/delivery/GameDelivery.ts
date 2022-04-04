import { IGameUseCase } from "server/domain/Game";

export default class GameDelivery {
  private gameUseCase: IGameUseCase;

  constructor(gameUseCase: IGameUseCase) {
    this.gameUseCase = gameUseCase;
  }
}
