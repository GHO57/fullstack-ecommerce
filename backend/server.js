const app = require("./app")
const dotenv = require("dotenv")
const { db_connection } = require("./config/database")

//.env config

dotenv.config({
    path: "./config/config.env"
})

//checking database connection status

db_connection()


//running the server

const server = app.listen(process.env.PORT, () => {
    console.log(`+ Server is running at http://localhost:${process.env.PORT}/`)
})

//handling uncaught exception

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}\n`)
    console.log(`Shutting down the server due to uncaught Exception `)
    process.exit(1)
})

//unhandled promise rejection

process.on("unhandledRejection", (err) => {
    console.log(`- Error : ${err.message}`)
    console.log(`\n- Shutting down the server due to unhandled promise rejection`)
    server.close(() => {
        process.exit(1)
    })
})