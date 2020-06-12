import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("nvarchar")
	name: string;

	@Column("nvarchar")
	email: string;

	@Column("nvarchar", { select: false })
	passwordHash: string;

	@Column("nvarchar", { select: false })
	passwordSalt: string;

	@Column("nvarchar")
	role: string;

	@Column("bit", { default: 0 })
	isDeleted: boolean;
}
