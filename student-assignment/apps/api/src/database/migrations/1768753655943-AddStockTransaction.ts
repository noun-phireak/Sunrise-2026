import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockTransaction1768753655943 implements MigrationInterface {
    name = 'AddStockTransaction1768753655943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."stock_transaction_type_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TABLE "stock_transaction" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "type" "public"."stock_transaction_type_enum" NOT NULL, "order_id" integer, "supplier_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8a81a89b9130bda3a5277cce53a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_transaction" ADD CONSTRAINT "FK_c0ba07239ce59e8c992a3d5f12b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_transaction" ADD CONSTRAINT "FK_51dcf3b7a6f8613858801dd7ddb" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_transaction" ADD CONSTRAINT "FK_80e3007ff21469a8df400261497" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_transaction" DROP CONSTRAINT "FK_80e3007ff21469a8df400261497"`);
        await queryRunner.query(`ALTER TABLE "stock_transaction" DROP CONSTRAINT "FK_51dcf3b7a6f8613858801dd7ddb"`);
        await queryRunner.query(`ALTER TABLE "stock_transaction" DROP CONSTRAINT "FK_c0ba07239ce59e8c992a3d5f12b"`);
        await queryRunner.query(`DROP TABLE "stock_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."stock_transaction_type_enum"`);
    }

}
