import { WorkLog } from "../../types/work-log.type";
import moment from "moment";

const sumHoursWorked = (accumulator: number, current: WorkLog) =>
	accumulator + current.hoursWorked;

const makeSafe = (unsafeHtml: string) =>
	unsafeHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function getWorkLogsAsHtml(workLogs: WorkLog[]) {
	const dateKeyedLogs = {} as { [va: string]: WorkLog[] };

	workLogs.forEach((workLog) => {
		dateKeyedLogs[workLog.date] = Array.isArray(dateKeyedLogs[workLog.date])
			? [...dateKeyedLogs[workLog.date], workLog]
			: [workLog];
	});

	return `data:text/html;charset=utf-8,${encodeURIComponent(`
<!DOCTYPE html>
<html lang="en">
    <body>${Object.keys(dateKeyedLogs)
					.map(
						(date) => `
        <ul>
            <li>
                Date: ${moment(date).format("YYYY.MM.DD")}
            </li>
            <li>
                Total time: ${dateKeyedLogs[date].reduce(sumHoursWorked, 0)}h
            </li>
            <li>
                Notes
            </li>
            <ul>
                ${dateKeyedLogs[date].map(
																	(note) =>
																		`
                <li>
                    ${note.hoursWorked}h ${makeSafe(
																			note.user.name
																		)} - ${makeSafe(note.note)}
                </li>`
																)}
            </ul>
        </ul>`
					)
					.join(" ")}
    </body>
</html>`)}`;
}
