import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexOnUserFields1719323663488 implements MigrationInterface {
    name = 'AddIndexOnUserFields1719323663488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_53197e5dba5dbaf94d29c8edbd" ON "game_schema"."user" ("handle") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "game_schema"."user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "game_schema"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "game_schema"."IDX_53197e5dba5dbaf94d29c8edbd"`);
    }

}
