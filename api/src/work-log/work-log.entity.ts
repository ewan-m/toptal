import {
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
} from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class WorkLog {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => User, { nullable: false, eager: true })
	@JoinColumn()
	user: User;

	@Column("datetime")
	date: string;

	@Column("tinyint")
	hoursWorked: number;

	@Column("nvarchar")
	note: string;
}
