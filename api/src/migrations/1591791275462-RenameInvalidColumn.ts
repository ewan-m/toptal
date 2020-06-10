import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameInvalidColumn1591791275462 implements MigrationInterface {
	name = "RenameInvalidColumn1591791275462";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "DF_c95e384ff549a266b7dcba999db" DEFAULT 0 FOR "isDeleted"`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "DF_c95e384ff549a266b7dcba999db"`
		);
	}
}
