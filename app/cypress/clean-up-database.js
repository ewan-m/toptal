const SQL_CONNECTION_STRING = process.argv[2];

if (!SQL_CONNECTION_STRING) {
	console.error(
		"Please provide a connection string to the test database as a command line argument. Eg: npm run e2e:cleanup -- 'mssql://username:password@localhost:11/glasshour'"
	);
	return 1;
}

const sql = require("mssql");

const cleanUpDB = () => {
	sql.connect(SQL_CONNECTION_STRING).then((connection) => {
		sql.query`
DELETE FROM [dbo].[user] WHERE SUBSTRING([name], 0, 15)='AUTOMATED_TEST';
DELETE FROM [dbo].[work_log] WHERE SUBSTRING([note], 0, 15)='AUTOMATED_TEST';`
.then(() => {
            connection.close();
            return 0;
        });
	});
};

cleanUpDB();
return 0;
