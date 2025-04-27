const jwt = require('jsonwebtoken')
const catchAsyncErrors = require('../middleware/catchAsynErrors')
const errorHandler = require('./errorHandler')


exports.checkToken = (tokenName) => catchAsyncErrors(async(req, res, next) => {
    const {tokenName} = req.cookies

    const decodedData = null

    switch(tokenName){
        case 'AUTHCOOKIE' : 
            decodedData = jwt.verify(tokenName, process.env.JWT_SECRET)
            break
        case 'ADMINAUTHCOOKIE' :
            decodedData = jwt.verify(tokenName, process.env.JWT_ADMIN_SECRET)
            break
        case 'SELLERAUTHCOOKIE' : 
            decodedData = jwt.verify(tokenName, process.env.JWT_SELLER_SECRET)
            break
    }

    if(decodedData != null && decodedData.length > 0) return true
    else false
})