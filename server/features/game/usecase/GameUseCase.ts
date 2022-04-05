import { Game, GameList, IGameRepository, IGameUseCase } from "../../../domain/Game";

export default class GameUseCase implements IGameUseCase {
  private gameRepo: IGameRepository;

  constructor(gameRepo: IGameRepository) {
    this.gameRepo = gameRepo;
  }

  public GetGames(): Game[] {
    return this.gameRepo.FindAll();
  }

  public GetGameInfo(gamePack: GameList): Game {
    return this.gameRepo.FindByGamePack(gamePack);
  }
}