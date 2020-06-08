import {
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class WorkLog {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created: string;

	@ManyToOne((type) => User, (user: User) => user.id)
	userId: number;
}
