import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TradeTreasureDto {
  @IsString()
  @ApiProperty({
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    description: 'ID of the user who is involved in trade'
  })
  recepientUserId: string;

  @IsString()
  @ApiProperty({
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    description: 'Inventory id to give'
  })
  initiatorInventoryId: string;

  @IsString()
  @ApiProperty({
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    description: 'Inventory id to take'
  })
  recepientInventoryId: string;
}