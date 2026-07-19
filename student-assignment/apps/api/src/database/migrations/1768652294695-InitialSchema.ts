import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768652294695 implements MigrationInterface {
    name = 'InitialSchema1768652294695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_1f9c6d05869e094dee8fa7d392a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "REL_a28028ba709cd7e5053a86857b" UNIQUE ("user_id"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "address" character varying, CONSTRAINT "REL_5d1f609371a285123294fddcf3" UNIQUE ("user_id"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "type_id" integer NOT NULL, "name" character varying NOT NULL, "avatar" character varying, "phone" character varying, "is_phone_verified" boolean NOT NULL DEFAULT false, "phone_verified_at" TIMESTAMP, "phone_verified_code" character varying, "email" character varying NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "email_verified_at" TIMESTAMP, "email_verified_code" character varying, "password" character varying NOT NULL, "password_last_update_at" TIMESTAMP, "password_last_updater" character varying, "is_notified_when_login" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_verified_code" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_3f5af4670c301dca5b9f7cd8545" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "icon" character varying, "description" character varying, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "category_id" integer NOT NULL, "supplier_id" integer, "name" character varying NOT NULL, "unit_price" numeric(10,2) NOT NULL, "image" character varying, "description" character varying, "qty" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "supplier" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying, "image" character varying, "description" character varying, CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock" ("id" SERIAL NOT NULL, "stocker_id" integer NOT NULL, "supplier_id" integer NOT NULL, "code" character varying NOT NULL, "status_id" integer NOT NULL, "total_price" numeric(10,2) NOT NULL, "sale_price" numeric(10,2), "stock_price" numeric(10,2) NOT NULL, "requested_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_method" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" SERIAL NOT NULL, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "qty" integer NOT NULL, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "cashier_id" integer, "status_id" integer NOT NULL, "payment_id" integer, "total_price" numeric(10,2) NOT NULL, "discount" numeric(10,2) NOT NULL DEFAULT '0', "amount_to_pay" numeric(10,2) NOT NULL, "paid_at" TIMESTAMP, "rejected_at" TIMESTAMP, "rejector_id" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_cat_fav" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "category_id" integer NOT NULL, "hits" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_1ff3068cf7918fe1ca394f775c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_prod_fav" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "product_id" integer NOT NULL, "hits" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a94d78544da6033faf05bca2f0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_detail" ("id" SERIAL NOT NULL, "stock_id" integer NOT NULL, "product_id" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "qty" integer NOT NULL, CONSTRAINT "PK_56b66fe40e340adc108aad032b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "FK_a28028ba709cd7e5053a86857b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_5d1f609371a285123294fddcf3a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1f9c6d05869e094dee8fa7d392a" FOREIGN KEY ("type_id") REFERENCES "user_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_verified_code" ADD CONSTRAINT "FK_9a92c851a8d90c5041e348dbd39" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_97bbe59fdd40a53bd9c95b6c01b" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_3633e056f450e44a2b6741a9839" FOREIGN KEY ("stocker_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_07908564f04cd0ba5a3ec0dceca" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_985d5f728e1eebe4a3eabc43aac" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_e746926056bddbfffe39f51dd5e" FOREIGN KEY ("cashier_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8ea75b2a26f83f3bc98b9c6aaf6" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_28c756d4fd41223fedfbd2750e1" FOREIGN KEY ("payment_id") REFERENCES "payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_ad45b2ac60756033952d5d64a45" FOREIGN KEY ("rejector_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_cat_fav" ADD CONSTRAINT "FK_4a540ac20605c38484c4d2cd066" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_cat_fav" ADD CONSTRAINT "FK_cfff8670f6e0403fcfce8e45c49" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_prod_fav" ADD CONSTRAINT "FK_61e96376e89f627cbf0e6e21afc" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_prod_fav" ADD CONSTRAINT "FK_e9fda8e2bf96019310d627783dd" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_detail" ADD CONSTRAINT "FK_48c3313be940225f40bc16aba44" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_detail" ADD CONSTRAINT "FK_7d82be8d375854d6ed58a3f08b6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_detail" DROP CONSTRAINT "FK_7d82be8d375854d6ed58a3f08b6"`);
        await queryRunner.query(`ALTER TABLE "stock_detail" DROP CONSTRAINT "FK_48c3313be940225f40bc16aba44"`);
        await queryRunner.query(`ALTER TABLE "customer_prod_fav" DROP CONSTRAINT "FK_e9fda8e2bf96019310d627783dd"`);
        await queryRunner.query(`ALTER TABLE "customer_prod_fav" DROP CONSTRAINT "FK_61e96376e89f627cbf0e6e21afc"`);
        await queryRunner.query(`ALTER TABLE "customer_cat_fav" DROP CONSTRAINT "FK_cfff8670f6e0403fcfce8e45c49"`);
        await queryRunner.query(`ALTER TABLE "customer_cat_fav" DROP CONSTRAINT "FK_4a540ac20605c38484c4d2cd066"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_ad45b2ac60756033952d5d64a45"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_28c756d4fd41223fedfbd2750e1"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8ea75b2a26f83f3bc98b9c6aaf6"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_e746926056bddbfffe39f51dd5e"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_985d5f728e1eebe4a3eabc43aac"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_07908564f04cd0ba5a3ec0dceca"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_3633e056f450e44a2b6741a9839"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_97bbe59fdd40a53bd9c95b6c01b"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
        await queryRunner.query(`ALTER TABLE "user_verified_code" DROP CONSTRAINT "FK_9a92c851a8d90c5041e348dbd39"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1f9c6d05869e094dee8fa7d392a"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_5d1f609371a285123294fddcf3a"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "FK_a28028ba709cd7e5053a86857b4"`);
        await queryRunner.query(`DROP TABLE "stock_detail"`);
        await queryRunner.query(`DROP TABLE "customer_prod_fav"`);
        await queryRunner.query(`DROP TABLE "customer_cat_fav"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "payment_method"`);
        await queryRunner.query(`DROP TABLE "stock"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user_verified_code"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "user_type"`);
    }

}
