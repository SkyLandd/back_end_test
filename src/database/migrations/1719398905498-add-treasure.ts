import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreasure1719398905498 implements MigrationInterface {
    name = 'AddTreasure1719398905498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_schema"."treasure_setting" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_59fd290b00832d34ee96ae5fb8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_schema"."treasure" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_1abd24b791187a2ac726e014df9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "game_schema"."treasure"`);
        await queryRunner.query(`DROP TABLE "game_schema"."treasure_setting"`);
    }

}
