const mysql = require("mysql2");

const pool = mysql
    .createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        waitForConnections: true,
        queueLimit: 0,
    })
    .promise();

const dbConnectionWithRetry = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
        try {
            const connection = await pool.getConnection();
            console.log("\x1b[32m+\x1b[0m Connected to Database");
            connection.release();
            return;
        } catch (error) {
            retries--;
            console.log(`\x1b[31m- Database connection failed (${retries} retries left): \x1b[0m`);
            if (retries === 0) {
                console.error(
                    "\x1b[31m- Exhausted retries. Exiting application.\x1b[0m\n",
                    "Error : ",
                    error
                );
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

module.exports = { pool, dbConnectionWithRetry };
