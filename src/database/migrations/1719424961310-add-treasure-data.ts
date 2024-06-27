import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreasureData1719424961310 implements MigrationInterface {
    name = 'AddTreasureData1719424961310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Ancient Coin', 'COMMON');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Golden Ring', 'RARE');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Mystic Amulet', 'EPIC');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Dragon Egg', 'LEGENDARY');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Silver Chalice', 'COMMON');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Jeweled Crown', 'RARE');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Enchanted Sword', 'EPIC');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Phoenix Feather', 'LEGENDARY');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Bronze Medal', 'COMMON');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Pearl Necklace', 'RARE');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Magic Staff', 'EPIC');
INSERT INTO "game_schema"."treasure" (name, type) VALUES ('Unicorn Horn', 'LEGENDARY');
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
