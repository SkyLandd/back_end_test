import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrade1719429696385 implements MigrationInterface {
    name = 'AddTrade1719429696385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_schema"."trade" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "initiator_user_id" character varying NOT NULL, "recepient_user_id" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'INITIATED', "initiator_treasure_id" character varying NOT NULL, "recepient_treasure_id" character varying NOT NULL, CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "game_schema"."trade"`);
    }

}
