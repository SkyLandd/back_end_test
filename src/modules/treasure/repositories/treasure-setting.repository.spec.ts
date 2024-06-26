import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ormConfig } from '@config/orm.config';
import { TreasureSettingEntity } from '@database/entities/treasure-setting.entity';
import { TreasureSettingRepository } from './treasure-setting.repository';
import { TreasureSettingType } from '../enums/treasure-setting-type.enum';

describe('TreasureSettingRepository', () => {
  let repository: TreasureSettingRepository;
  let module: TestingModule;
  let savedSettings: TreasureSettingEntity[];

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...ormConfig,
          entities: [TreasureSettingEntity]
        }),
        TypeOrmModule.forFeature([TreasureSettingEntity])
      ],
      providers: [TreasureSettingRepository],
    }).compile();

    repository = module.get<TreasureSettingRepository>(TreasureSettingRepository);
  });

  beforeEach(async () => {
    const settingsToSave = [];
    const treasureSetting1 = new TreasureSettingEntity();
    treasureSetting1.type = TreasureSettingType.DAILY_LIMIT;
    treasureSetting1.value = `10`;


    const treasureSetting2 = new TreasureSettingEntity();
    treasureSetting2.type = TreasureSettingType.WEEKLY_LIMIT;
    treasureSetting2.value = `10`;

    settingsToSave.push(treasureSetting1);
    settingsToSave.push(treasureSetting2);

    savedSettings = await repository.save(settingsToSave);
  })

  afterEach(async () => {
    // Close the database connection after all tests
    await module.get(getRepositoryToken(TreasureSettingEntity)).clear();
  });

  afterEach(async () => {
    await module.close();
  })

  describe('findOneBy', () => {
    it('settings should be defined', async () => {
      expect(savedSettings.length).toBeGreaterThan(0)
    })

    it('should return a setting if queried by id', async () => {
      const id = savedSettings[0].id;
      const foundSetting = await repository.findOneBy({ id });
      expect(foundSetting).toBeDefined();
    })

    it('should return a setting if queried by type', async () => {
      const type = savedSettings[1].type;
      const foundSetting = await repository.findOneBy({ type });
      expect(foundSetting).toBeDefined();
    })
  })

  describe('findBulkBy', () => {
    it('settings should be defined', async () => {
      expect(savedSettings.length).toBeGreaterThan(0)
    })

    it('should return settings if queried by ids', async () => {
      const ids = savedSettings.map(sT => sT.id);
      const foundSettings = await repository.findBulkBy({ ids });

      expect(foundSettings).toBeDefined();
      expect(ids.length).toBeGreaterThan(0);
      expect(foundSettings.length).toBe(savedSettings.length);
    })

    it('should return settings if queried by types', async () => {
      const types = savedSettings.map(sT => sT.type);
      const foundSettings = await repository.findBulkBy({ types });

      expect(foundSettings).toBeDefined();
      expect(types.length).toBeGreaterThan(0);
      expect(foundSettings.length).toBe(savedSettings.length);
    })
  })
});