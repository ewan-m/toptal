import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../auth/user.entity";
import { HasUserManagementPrivileges } from "../guards/has-user-management-privileges.guard";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";

@Controller()
export class UsersController {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	@Get("/users")
	@UseGuards(HasValidTokenGuard, HasUserManagementPrivileges)
	getUsers() {
		return this.userRepository.find();
	}

	@Get("/users/:userId")
	@UseGuards(HasValidTokenGuard, HasUserManagementPrivileges)
	getUser(@Param() { userId }) {
		return this.userRepository.find({ id: userId });
	}

	@Post("/users")
	@UseGuards(HasValidTokenGuard, HasUserManagementPrivileges)
	async createUser(@Body() createUserDto: CreateUserDto) {
		const user = new User();

		Object.keys(createUserDto).forEach((key) => {
			user[key] = createUserDto[key];
		});

		user.passwordHash = "";
		user.passwordSalt = "";

		return this.userRepository.save(user);
	}

	@Patch("/users/:userId")
	@UseGuards(HasValidTokenGuard, HasUserManagementPrivileges)
	async updateUser(@Body() updateUserDto: UpdateUserDto, @Param() { userId }) {
		const user = await this.userRepository.findOne({ id: userId });

		if (!user) {
			throw new NotFoundException(["A user with that id was not found."]);
		}
		Object.keys(updateUserDto).forEach((key) => {
			if (updateUserDto[key]) {
				user[key] = updateUserDto[key];
			}
		});

		return this.userRepository.save(user);
	}

	@Delete("/users/:userId")
	@UseGuards(HasValidTokenGuard, HasUserManagementPrivileges)
	async deleteUser(@Param() { userId }) {
		const user = await this.userRepository.findOne({ id: userId });

		if (!user) {
			throw new NotFoundException(["A user with that id was not found."]);
		}

		user.isDeleted = true;
		user.name = "[deleted]";
		return this.userRepository.save(user);
	}
}
