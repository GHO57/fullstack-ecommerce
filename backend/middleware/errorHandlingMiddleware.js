const errorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    //JWT Expire Error

    if(err.name = "TokenExpiredError"){
        const message = "JWT has been expired. Try Again."
        err = new errorHandler(message, 404)
    }

    //Wrong JWT Error

    if(err.name = "JsonWebTokenError"){
        const message = "JWT is invalid. Try Again."
        err = new errorHandler(message, 404)
    }

    res.status(statusCode).json({
        success: false,
        message: message
    })
}