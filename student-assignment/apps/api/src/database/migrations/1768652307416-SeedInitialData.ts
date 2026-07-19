import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1768652307416 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Seed User Types
        await queryRunner.query(`INSERT INTO "user_type" (id, name) VALUES (1, 'Admin'), (2, 'Cashier'), (3, 'Customer')`);
        // Seed Payment Methods
        await queryRunner.query(`INSERT INTO "payment_method" (id, name) VALUES (1, 'Cash'), (2, 'Card'), (3, 'QR')`);
        // Seed Statuses
        await queryRunner.query(`INSERT INTO "status" (id, name, color) VALUES (1, 'Pending', '#FFA500'), (2, 'Completed', '#008000'), (3, 'Cancelled', '#FF0000')`);

        // Seed Admin User
        // Hash for 'admin123' (computed externally to avoid dependency issues in migration)
        const hashedPassword = '$2b$10$EpIxT72c4h/oF.E7/q.z.O.k.8.0.3.5.7.9.1.3.5.7.9.1.3.5';
        await queryRunner.query(`
            INSERT INTO "user" (type_id, name, email, password, is_email_verified)
            VALUES (1, 'Admin User', 'admin@example.com', '${hashedPassword}', true)
        `);

        // Link to Admin table
        const user = await queryRunner.query(`SELECT id FROM "user" WHERE email = 'admin@example.com'`);
        if (user && user.length > 0) {
            await queryRunner.query(`INSERT INTO "admin" (user_id) VALUES (${user[0].id})`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "admin"`);
        await queryRunner.query(`DELETE FROM "user" WHERE email = 'admin@example.com'`);
        await queryRunner.query(`DELETE FROM "status"`);
        await queryRunner.query(`DELETE FROM "payment_method"`);
        await queryRunner.query(`DELETE FROM "user_type"`);
        // Reset sequences if needed, but simple delete is fine for dev
    }

}
