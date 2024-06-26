import { TreasureEntity } from "@database/entities/treasure.entity";
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
  @IsLongitude()
  long: string;

  @IsLatitude()
  lat: string;
}

export class CollectTreasureDto {
  @ValidateNested()
  treasurePosition: GameCoordinatesDto;

  @IsString()
  treasureId: string;

  @IsString()
  sessionId: string;
}