import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkLog } from "../entities/work-log";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	passwordHash: string;

	@Column()
	passwordSalt: string;

	@Column()
	role: string;

	@OneToMany((type) => WorkLog, (workLog: WorkLog) => workLog.userId)
	workLogs: WorkLog[];
}
