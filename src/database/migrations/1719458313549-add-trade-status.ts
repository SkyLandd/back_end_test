import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTradeStatus1719458313549 implements MigrationInterface {
    name = 'AddTradeStatus1719458313549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" DROP COLUMN "initiator_treasure_id"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" DROP COLUMN "recepient_treasure_id"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" DROP COLUMN "is_traded"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" ADD "initiator_inventory_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" ADD "recepient_inventory_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ADD "trade_id" character varying`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ADD "status" character varying NOT NULL DEFAULT 'COLLECTED'`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ALTER COLUMN "session_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ALTER COLUMN "session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" DROP COLUMN "trade_id"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" DROP COLUMN "recepient_inventory_id"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" DROP COLUMN "initiator_inventory_id"`);
        await queryRunner.query(`ALTER TABLE "game_schema"."user_inventory" ADD "is_traded" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" ADD "recepient_treasure_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game_schema"."trade" ADD "initiator_treasure_id" character varying NOT NULL`);
    }

}
