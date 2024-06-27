import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreasureInventory1719424961303 implements MigrationInterface {
    name = 'AddTreasureInventory1719424961303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_schema"."user_inventory" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "treasure_id" character varying NOT NULL, "treasure_position" jsonb NOT NULL, "session_id" character varying NOT NULL, "is_traded" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_193d6e1b301eda020c2492d3d9c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "game_schema"."user_inventory"`);
    }

}
