import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTreasurePositionToNullable1719467337707 implements MigrationInterface {
    name = 'UpdateTreasurePositionToNullable1719467337707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ALTER COLUMN "treasure_position" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ALTER COLUMN "treasure_position" SET NOT NULL`);
    }

}
