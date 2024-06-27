import { Module } from "@nestjs/common";
import { UserLocationService } from "./services/user-location.service";
import { TreasureDistributionService } from "./services/treasure-distribution.service";
import { GameService } from "./services/game.service";
import { TreasureModule } from "@modules/treasure/treasure.module";
import { UserModule } from "@modules/user/user.module";
import { CustomCacheModule } from "@modules/cache/cache.module";
import { GameController } from "./controllers/game.controller";

@Module({
  imports: [
    TreasureModule,
    UserModule,
    CustomCacheModule
  ],
  controllers: [GameController],
  providers: [
    UserLocationService,
    TreasureDistributionService,
    GameService
  ],
  exports: [GameService]
})
export class GameModule { }