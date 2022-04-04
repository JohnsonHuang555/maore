import { Game, IGameRepository, IGameUseCase } from "../../../domain/Game";

export default class GameUseCase implements IGameUseCase {
  private gameRepo: IGameRepository;

  constructor(gameRepo: IGameRepository) {
    this.gameRepo = gameRepo;
  }

  public GetGames(): Game[] {
    return this.gameRepo.FindAll();
  }

  public GetGameInfo(id: number): Game {
    return this.gameRepo.FindById(id);
  }
}