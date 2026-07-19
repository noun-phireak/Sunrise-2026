import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToOrder1768753875633 implements MigrationInterface {
    name = 'AddCreatedAtToOrder1768753875633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "created_at"`);
    }

}
