import { WorkLog } from "../../types/work-log.type";

export function getWorkLogsAsHtml(workLogs: WorkLog[]) {
	return `data:text/json;charset=utf-8,${encodeURIComponent(`<!DOCTYPE html>
    <html lang="en">
    <body>
    <p>Hiya</p>
    </body>
    </html>`)}`;
}
