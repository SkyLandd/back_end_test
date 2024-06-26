import { TreasureEntity } from "@database/entities/treasure.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsString, ValidateNested } from "class-validator";

export interface IStoredTreasure {
  treasure: TreasureEntity;
  position: GameCoordinatesDto;
}

export interface IStoredPosition {
  timestamp: number;
  position: GameCoordinatesDto;
}

export class GameCoordinatesDto {
  @ApiProperty({
    example: '151.209900',
    description: 'Longitude of the location'
  })
  @IsLongitude()
  long: string;

  @ApiProperty({
    example: '-33.865143',
    description: 'Latitude of the location'
  })
  @IsLatitude()
  lat: string;
}

export class CollectTreasureDto {
  @ApiProperty({
    type: GameCoordinatesDto,
    description: 'Coordinates of the treasure'
  })
  @ValidateNested()
  treasurePosition: GameCoordinatesDto;

  @ApiProperty({
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
    description: 'ID of the treasure'
  })
  @IsString()
  treasureId: string;

  @ApiProperty({
    example: 'd44a2180-64bb-42ec-a945-5fd21dec0555',
    description: 'Session ID of the game/user'
  })
  @IsString()
  sessionId: string;
}