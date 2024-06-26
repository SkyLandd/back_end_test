import { JwtGuard } from "@modules/auth/guards/jwt.guard";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CollectTreasureDto } from "../dtos/treasure-collect.dto";
import { GameService } from "../services/game.service";
import { User } from "@modules/auth/decorators/grant-payload.decorator";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { TOKEN_NAME } from "@common/constants/auth";

@ApiTags('Game')
@Controller('game')
@ApiSecurity(TOKEN_NAME)
export class GameController {
  constructor(
    private gameService: GameService
  ) { }

  @Post('collect-treasure')
  @UseGuards(JwtGuard)
  public async collectTreasure(
    @Body() collectTreasureDto: CollectTreasureDto,
    @User() user: IGrantPayload,
  ) {
    return this.gameService.collectTreasure(collectTreasureDto, user);
  }

  /**
   * Just for testing purpose - should be implemented using websockets 
   * in secure channel so that this can be real time and game friendly
   * 
   * @param user 
   * @returns 
   */
  @Get('session')
  @UseGuards(JwtGuard)
  public async createSession(
    @User() user: IGrantPayload,
  ) {
    return this.gameService.createSession();
  }
}