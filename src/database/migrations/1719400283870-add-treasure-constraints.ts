import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreasureConstraints1719400283870 implements MigrationInterface {
    name = 'AddTreasureConstraints1719400283870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_schema"."treasure_setting" ADD CONSTRAINT "UQ_c3ccbede4e25b2392cbc2912dcf" UNIQUE ("type")`);
        await queryRunner.query(`CREATE INDEX "IDX_c3ccbede4e25b2392cbc2912dc" ON "game_schema"."treasure_setting" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_f889d372f742f4abe053a6ab6f" ON "game_schema"."treasure" ("type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "game_schema"."IDX_f889d372f742f4abe053a6ab6f"`);
        await queryRunner.query(`DROP INDEX "game_schema"."IDX_c3ccbede4e25b2392cbc2912dc"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."treasure_setting" DROP CONSTRAINT "UQ_c3ccbede4e25b2392cbc2912dcf"`);
    }

}
