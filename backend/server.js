const app = require("./app")
const dotenv = require("dotenv")
const { db_connection } = require("./config/database")
const path = require("path")
const express = require("express")

//.env config

dotenv.config({
    path: "./config/config.env"
})

//checking database connection status

db_connection()

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});


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