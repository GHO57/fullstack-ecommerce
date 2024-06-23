const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware")

//.env config

dotenv.config({
    path : "./config/config.env"
})

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//backend routes 

const admin = require("./routes/adminRoutes")
const user = require("./routes/userRoutes")
const cart = require("./routes/cartRoutes")
const seller = require("./routes/sellerRoutes")
const product = require("./routes/productRoutes")
const payment = require("./routes/paymentRoutes")

app.use("/api/v1/admin", admin)
app.use("/api/v1/user", user)
app.use("/api/v1/user/cart", cart)
app.use("/api/v1/seller", seller)
app.use("/api/v1/product", product)
app.use("/api/v1/payment", payment)


//middleware for errors

app.use(errorHandlingMiddleware)

module.exports = app