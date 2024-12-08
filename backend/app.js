const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");

//.env config

dotenv.config({
    path: "./config/config.env",
});

app.use(
    cors({
        origin: "https://fullstack-ecommerce-gho57s-projects.vercel.app/",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//backend routes

const admin = require("./routes/adminRoutes");
const user = require("./routes/userRoutes");
const cart = require("./routes/cartRoutes");
const seller = require("./routes/sellerRoutes");
const product = require("./routes/productRoutes");
const payment = require("./routes/paymentRoutes");
const wishlist = require("./routes/wishlistRoutes");

app.use("/api/v1/admin", admin);
app.use("/api/v1/user", user);
app.use("/api/v1/user/cart", cart);
app.use("/api/v1/seller", seller);
app.use("/api/v1/product", product);
app.use("/api/v1/payment", payment);
app.use("/api/v1/wishlist", wishlist);

//middleware for errors

app.use(errorHandlingMiddleware);

module.exports = app;
