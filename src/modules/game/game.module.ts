import { Module } from "@nestjs/common";
import { UserLocationService } from "./services/user-location.service";
import { TreasureDistributionService } from "./services/treasure-distribution.service";
import { GameService } from "./services/game.service";
import { TreasureModule } from "@modules/treasure/treasure.module";

@Module({
  imports: [
    TreasureModule
  ],
  providers: [
    UserLocationService,
    TreasureDistributionService,
    GameService
  ],
  exports: [GameService]
})
export class GameModule { }