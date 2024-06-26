import { Injectable } from "@nestjs/common";
import { TreasureType } from "./treasure-type.enum";
import { TreasureRepository } from "./repository/treasure.repository";
import { TreasureSettingType } from "./treasure-setting-type.enum";
import { TreasureSettingRepository } from "./repository/treasure-setting.repository";

@Injectable()
export class TreasureService {
  constructor(
    private treasureRepo: TreasureRepository,
    private treasureSettingRepo: TreasureSettingRepository,
  ) { }

  // Handling it currently through migration i.e it is not exposed for users to manage - assuming this would configured beforehand.
  // public async saveOne() { }

  public async findOneBy(filter: { id: string }) {
    return this.treasureRepo.findOneBy(filter);
  }

  public async findBulkBy(filter: { type?: TreasureType, ids?: string[] }) {
    return this.treasureRepo.findBulkBy(filter);
  }

  public async findSettingBy(filter: { type: TreasureSettingType }) {
    return this.treasureSettingRepo.findOneBy(filter);
  }
}