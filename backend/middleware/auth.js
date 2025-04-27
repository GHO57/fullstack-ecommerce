const jwt = require("jsonwebtoken")
const catchAsyncErrors = require("./catchAsynErrors")
const errorHandler = require("../utils/errorHandler")
const { pool } = require("../config/database")

exports.isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const { AUTHCOOKIE } = req.cookies

    if(!AUTHCOOKIE){
        return next(new errorHandler("You're not logged in", 401))
    }

    const decodedData = jwt.verify(AUTHCOOKIE, process.env.JWT_SECRET)

    req.user = await pool.execute('SELECT u.id as userId, u.fullname, u.email, c.id as cartId FROM users u, carts c WHERE c.user_id = u.id && u.id = ?', [decodedData.userId])

    next()
})

exports.isSellerAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const { SELLERAUTHCOOKIE } = req.cookies

    if(!SELLERAUTHCOOKIE){
        return next(new errorHandler("You're not logged in as seller.", 401))
    }

    const decodedData = jwt.verify(SELLERAUTHCOOKIE, process.env.JWT_SELLER_SECRET)

    
    req.user = await pool.execute('SELECT id, email, gstin, role FROM sellers WHERE id = ?', [decodedData.id])

    next()
})

exports.isAdminAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const { ADMINAUTHCOOKIE } = req.cookies

    if(!ADMINAUTHCOOKIE){
        return next(new errorHandler("You're not logged in as admin.", 401))
    }

    const decodedData = jwt.verify(ADMINAUTHCOOKIE, process.env.JWT_ADMIN_SECRET)

    
    req.user = await pool.execute('SELECT id, email, role FROM admins WHERE id = ?', [decodedData.id])
    
    next()
})

exports.authorizeRoles = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user[0][0].role)){
            return next(new errorHandler("Cannot access the resource", 403))
        }
        next()
    }
}