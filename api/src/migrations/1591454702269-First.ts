import { MigrationInterface, QueryRunner } from "typeorm";

export class First1591454702269 implements MigrationInterface {
	name = "First1591454702269";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "work_log" ("id" int NOT NULL IDENTITY(1,1), "created" datetime2 NOT NULL CONSTRAINT "DF_2eb0b00f9d62132feb454791134" DEFAULT getdate(), "userIdId" int, CONSTRAINT "PK_65e2816b0d0876024e3754656b9" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "passwordHash" nvarchar(255) NOT NULL, "passwordSalt" nvarchar(255) NOT NULL, "role" nvarchar(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "user_preference" ("id" int NOT NULL IDENTITY(1,1), "preferredWorkingHourPerDay" int NOT NULL, CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "work_log" ADD CONSTRAINT "FK_3c35ed877ece582d37dc1ab6789" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "work_log" DROP CONSTRAINT "FK_3c35ed877ece582d37dc1ab6789"`
		);
		await queryRunner.query(`DROP TABLE "user_preference"`);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(`DROP TABLE "work_log"`);
	}
}
