const app = require("./app");
const dotenv = require("dotenv");
const { dbConnectionWithRetry } = require("./config/database");
const path = require("path");
const express = require("express");
const http = require("http");
const { initializeSocket } = require("./config/socket");

//.env config

dotenv.config({
    path: "./config/config.env",
});

const server = http.createServer(app);
const io = initializeSocket(server);

const startServer = async () => {
    try {
        //check database connection
        await dbConnectionWithRetry();

        //start the server
        server.listen(process.env.PORT, () => {
            console.log(
                `\x1b[32m+\x1b[0m Server is running at http://localhost:${process.env.PORT}/`
            );
        });

        // io.on("connection", (socket) => {
        //     // console.log(`Client Connected:`, socket.id);

        //     socket.on("inventory_update", (data) => {
        //         // console.log("Received stock update from client:", data);
        //     });

        //     socket.on("disconnect", () => {
        //         // console.log("User disconnected :", socket.id);
        //     });
        // });
    } catch (error) {
        console.error("\x1b[31m- Failed to start the server: \x1b[0m", error.message);
        process.exit(1);
    }
};

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

startServer();

//handling uncaught exception

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}\n`);
    console.log(`Shutting down the server due to uncaught Exception `);
    process.exit(1);
});

//unhandled promise rejection

process.on("unhandledRejection", (err, promise) => {
    // console.log(`- Error : ${err.message}`)
    console.error("Unhandled Rejection at:", promise, "reason:", err);
    console.log(`\n- Shutting down the server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});
