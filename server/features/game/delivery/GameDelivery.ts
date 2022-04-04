import { IGameUseCase } from "server/domain/Game";
import { Express } from 'express';

export default class GameDelivery {
  private gameUseCase: IGameUseCase;
  private app: Express;

  constructor(app: Express, gameUseCase: IGameUseCase) {
    this.gameUseCase = gameUseCase;
    this.app = app;

    this.app.get('/api/games', this.FetchGames.bind(this));
  }

  public FetchGames(_req: any, res: any) {
    const games = this.gameUseCase.GetGames();
    return res.status(200).json(games);
  }
}
