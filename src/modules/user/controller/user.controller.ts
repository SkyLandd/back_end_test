import { TOKEN_NAME } from "@common/constants/auth";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { JwtGuard } from "@modules/auth/guards/jwt.guard";
import { User } from "@modules/auth/decorators/grant-payload.decorator";
import { IGrantPayload } from "@common/interfaces/IGrantPayload";
import { TradeTreasureDto } from "../dtos/trade-treasure.dto";

@ApiTags('User')
@Controller('user')
@ApiSecurity(TOKEN_NAME)
export class UserController {
  constructor(
    private userService: UserService
  ) { }

  @Post('/trade-treasure')
  @UseGuards(JwtGuard)
  public async tradeTreasure(
    @User() user: IGrantPayload,
    @Body() tradeTreasureDto: TradeTreasureDto,
  ) {
    return this.userService.initiateTrade(tradeTreasureDto, user);
  }

  @Get('/requested-trade')
  @UseGuards(JwtGuard)
  public async getRequestedTrade(
    @User() user: IGrantPayload,
  ) {
    return this.userService.requestedTrades(user);
  }

  @Get('/initiated-trade')
  @UseGuards(JwtGuard)
  public async getInitiatedTrade(
    @User() user: IGrantPayload,
  ) {
    return this.userService.initiatedTrades(user);
  }
}
