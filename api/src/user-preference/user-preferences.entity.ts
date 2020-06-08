import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class UserPreference {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne((type) => User, (user: User) => user.id)
	userId: number;

	@Column()
	preferredWorkingHourPerDay: number;
}
