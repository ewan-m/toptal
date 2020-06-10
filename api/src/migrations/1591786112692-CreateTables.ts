import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1591786112692 implements MigrationInterface {
	name = "CreateTables1591786112692";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "passwordHash" nvarchar(255) NOT NULL, "passwordSalt" nvarchar(255) NOT NULL, "role" nvarchar(255) NOT NULL, "isActive" bit NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "user_preference" ("id" int NOT NULL IDENTITY(1,1), "preferredWorkingHourPerDay" tinyint NOT NULL, "userId" int NOT NULL, CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "REL_5b141fbd1fef95a0540f7e7d1e" ON "user_preference" ("userId") WHERE "userId" IS NOT NULL`
		);
		await queryRunner.query(
			`CREATE TABLE "work_log" ("id" int NOT NULL IDENTITY(1,1), "date" varchar(255) NOT NULL, "hoursWorked" tinyint NOT NULL, "note" nvarchar(255) NOT NULL, "userId" int NOT NULL, CONSTRAINT "PK_65e2816b0d0876024e3754656b9" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "user_preference" ADD CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "work_log" ADD CONSTRAINT "FK_73f1c1d93a99b251719ac34ab76" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "work_log" DROP CONSTRAINT "FK_73f1c1d93a99b251719ac34ab76"`
		);
		await queryRunner.query(
			`ALTER TABLE "user_preference" DROP CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2"`
		);
		await queryRunner.query(`DROP TABLE "work_log"`);
		await queryRunner.query(
			`DROP INDEX "REL_5b141fbd1fef95a0540f7e7d1e" ON "user_preference"`
		);
		await queryRunner.query(`DROP TABLE "user_preference"`);
		await queryRunner.query(`DROP TABLE "user"`);
	}
}
