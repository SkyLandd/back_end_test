import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ormConfig } from '@config/orm.config';
import { TreasureRepository } from './treasure.repository';
import { TreasureEntity } from '@database/entities/treasure.entity';
import { TreasureType } from '../enums/treasure-type.enum';

describe('TreasureRepository', () => {
  let repository: TreasureRepository;
  let module: TestingModule;
  let savedTreasures: TreasureEntity[];

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...ormConfig,
          entities: [TreasureEntity]
        }),
        TypeOrmModule.forFeature([TreasureEntity])
      ],
      providers: [TreasureRepository],
    }).compile();

    repository = module.get<TreasureRepository>(TreasureRepository);
  });

  beforeEach(async () => {
    const treasures = [];

    for(let type of Object.keys(TreasureType)) {
      const treasure = new TreasureEntity();
      treasure.name = 'Treasure 1';
      treasure.type = TreasureType[type];

      treasures.push(treasure);
    }

    savedTreasures = await repository.save(treasures);
  })

  afterEach(async () => {
    // Close the database connection after all tests
    await module.get(getRepositoryToken(TreasureEntity)).clear();
  });

  afterEach(async () => {
    await module.close();
  })

  describe('findOneBy', () => {
    it('treasure should be defined', async () => {
      expect(savedTreasures.length).toBeGreaterThan(0)
    })

    it('should return treasure if queried by id', async () => {
      const id = savedTreasures[0].id;
      const foundTreasure = await repository.findOneBy({ id });
      expect(foundTreasure).toBeDefined();
    })
  })

  describe('findBulkBy', () => {
    it('treasure should be defined', async () => {
      expect(savedTreasures.length).toBeGreaterThan(0)
    })

    it('should return treasures if queried by ids', async () => {
      const ids = savedTreasures.map(sT => sT.id);
      const foundTreasures = await repository.findBulkBy({ ids });

      expect(foundTreasures).toBeDefined();
      expect(ids.length).toBeGreaterThan(0);
      expect(foundTreasures.length).toBe(savedTreasures.length);
    })

    it('should return treasures if queried by types', async () => {
      const types = savedTreasures.map(sT => sT.type);
      const foundTreasures = await repository.findBulkBy({ types });

      expect(foundTreasures).toBeDefined();
      expect(types.length).toBeGreaterThan(0);
      expect(foundTreasures.length).toBe(savedTreasures.length);
    })
  })
});