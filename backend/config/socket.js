const socketIo = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: `http://localhost:${process.env.PORT}`, // Your frontend URL
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        // console.log(`Client connected: ${socket.id}`);

        socket.on("join_cart", () => {
            socket.join("cart_room");
            // console.log(`${socket.id} joined cart_room`);
        });

        socket.on("leave_cart", () => {
            socket.leave("cart_room");
            // console.log(`${socket.id} left cart_room`);
        });

        socket.on("disconnect", () => {
            // console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized! Call initializeSocket first.");
    }
    return io;
};

module.exports = { initializeSocket, getIo };
