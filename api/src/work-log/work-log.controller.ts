import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { decode } from "jsonwebtoken";
import { Repository } from "typeorm";
import { TokenPayload } from "../auth/token-payload.type";
import { User } from "../auth/user.entity";
import { HasValidTokenGuard } from "../guards/has-valid-token.guard";
import { IsNotUserManagerGuard } from "../guards/is-not-user-manager.guard";
import { CreateWorkLogDto } from "./create-work-log.dto";
import { DateFilterDto, getDateQuery } from "./date-filter.dto";
import { UpdateWorkLogDto } from "./update-work-log.dto";
import { WorkLog } from "./work-log.entity";

@Controller()
export class WorkLogController {
	constructor(
		@InjectRepository(WorkLog)
		private readonly workLogRepository: Repository<WorkLog>
	) {}

	@Get("/work-log")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async getWorkLogs(
		@Headers("authorization") authHeader: string,
		@Query() dateFilter?: DateFilterDto
	) {
		const token = this.parseToken(authHeader);

		const result = this.workLogRepository.find({
			where: {
				...(token.role === "admin" ? {} : { user: { id: token.id } }),
				...(dateFilter?.from || dateFilter?.to
					? { date: getDateQuery(dateFilter) }
					: {}),
			},
		});

		return result;
	}

	@Get("/work-log/:recordId")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async getWorkLog(
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
			throw new ForbiddenException(["Insufficient permissions to view record."]);
		}
		return matchingRecord;
	}

	@Post("/work-log")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async createWorkLog(
		@Headers("authorization") authHeader: string,
		@Body() workLogDto: CreateWorkLogDto
	) {
		const token = this.parseToken(authHeader);
		const userId = token.id;

		const workLog = new WorkLog();
		workLog.user = { id: userId } as User;
		workLog.note = workLogDto.note;
		workLog.hoursWorked = workLogDto.hoursWorked;
		workLog.date = workLogDto.date;

		return this.workLogRepository.save(workLog);
	}

	@Patch("/work-log/:recordId")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async updateWorkLog(
		@Headers("authorization") authHeader: string,
		@Param() { recordId },
		@Body() workLogDto: UpdateWorkLogDto
	) {
		const matchingRecord = await this.workLogRepository.findOne({ id: recordId });

		if (!matchingRecord) {
			throw new NotFoundException();
		}
		const token = this.parseToken(authHeader);
		const userId = token.id;

		if (token.role === "user" && matchingRecord.user.id !== userId) {
			throw new ForbiddenException(["Insufficient permissions to update record."]);
		}

		Object.keys(workLogDto).forEach((key) => {
			if (workLogDto[key]) {
				matchingRecord[key] = workLogDto[key];
			}
		});

		return this.workLogRepository.save(matchingRecord);
	}

	@Delete("/work-log/:recordId")
	@UseGuards(HasValidTokenGuard, IsNotUserManagerGuard)
	async deleteWorkLog(
		@Headers("authorization") authHeader: string,
		@Param() { recordId }
	) {
		const matchingRecord = await this.workLogRepository.findOne({
			id: recordId,
		});

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
