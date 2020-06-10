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

	@ManyToOne((type) => User, { nullable: false })
	@JoinColumn()
	user: User;

	@Column("varchar")
	date: string;

	@Column("tinyint")
	hoursWorked: number;

	@Column("nvarchar")
	note: string;
}
