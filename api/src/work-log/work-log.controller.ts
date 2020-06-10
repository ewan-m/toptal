import {
	Controller,
	Get,
	UseGuards,
	Headers,
	Delete,
	Param,
	Patch,
	Post,
	Put,
	Body,
	InternalServerErrorException,
	ForbiddenException,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkLog } from "./work-log.entity";
import { Repository } from "typeorm";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { WorkLogDto } from "./work-log.dto";
import { decode } from "jsonwebtoken";
import { TokenPayload } from "src/auth/token-payload.type";
import { IsNotUserManagerGuard } from "src/guards/is-not-user-manager.guard";

@Controller()
export class UserPreferencesController {
	constructor(
		@InjectRepository(WorkLog)
		private readonly workLogRepository: Repository<WorkLog>
	) {}

	@Get("/work-log")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async getWorkLogs(@Headers("authorization") authHeader: string) {}

	@Post("/work-log")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async createWorkLog(
		@Headers("authorization") authHeader: string,
		@Body() workLogDto: WorkLogDto
	) {}

	@Put("/work-log/:recordId")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async updateWorkLog(
		@Headers("authorization") authHeader: string,
		@Param() { recordId },
		@Body() workLogDto: WorkLogDto
	) {}

	@Delete("/work-log/:recordId")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async deleteWorkLog(
		@Headers("authorization") authHeader: string,
		@Param() { recordId }
	) {
		const matchingRecord = await this.workLogRepository.findOne({ id: recordId });

		if (!matchingRecord) {
			throw new NotFoundException();
		}

		const token = this.parseToken(authHeader);
		const userId = token.id;

		if (token.role === "user" && matchingRecord.user.id !== userId) {
			throw new ForbiddenException(["Insufficient permissions to delete record."]);
		}

		await this.workLogRepository.delete(matchingRecord);
		return { id: matchingRecord.id };
	}

	private parseToken(authHeader: string) {
		const token = authHeader.split(" ")?.[1];

		if (token) {
			try {
				return decode(token) as TokenPayload;
			} catch (error) {}
		}
		throw new InternalServerErrorException(["Something went wrong."]);
	}
}
