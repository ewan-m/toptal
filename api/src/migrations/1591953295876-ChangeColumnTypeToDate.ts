import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnTypeToDate1591953295876 implements MigrationInterface {
	name = "ChangeColumnTypeToDate1591953295876";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "work_log" DROP COLUMN "date"`);
		await queryRunner.query(
			`ALTER TABLE "work_log" ADD "date" datetime NOT NULL`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "work_log" DROP COLUMN "date"`);
		await queryRunner.query(
			`ALTER TABLE "work_log" ADD "date" varchar(255) NOT NULL`
		);
	}
}
