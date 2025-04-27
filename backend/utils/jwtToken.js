const jwt = require("jsonwebtoken")

const sendToken = (user, cartId, statusCode, res) => {
    const id = user[0].id
    const email = user[0].email

    const token = jwt.sign({ userId: id, email: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    const cartToken = jwt.sign({ cartId: cartId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        SameSite: "Strict",
        secure: true
    }

    res.status(statusCode).cookie("AUTHCOOKIE", token, options).cookie("CARTID", cartToken, options).json({
        success: true,
        user,
        cartId,
        token
    })
}

const sendSellerToken = (seller, sellerProducts, deletedProducts, statusCode, res) => {
    const id = seller[0].id
    const email = seller[0].email
    const gstin = seller[0].gstin

    const token = jwt.sign({ id: id, email: email, gstin: gstin }, process.env.JWT_SELLER_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        SameSite: "Strict",
        secure: true
    }

    res.status(statusCode).cookie("SELLERAUTHCOOKIE", token, options).json({
        success: true,
        seller,
        sellerProducts,
        deletedProducts,
        token
    })
}

const sendAdminToken = (admin, statusCode, res) => {
    const id = admin[0].id
    const email = admin[0].email

    const token = jwt.sign({ id: id, email: email }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        SameSite: "Strict",
        secure: true
    }

    res.status(statusCode).cookie("ADMINAUTHCOOKIE", token, options).json({
        success: true,
        admin,
        token
    })
}

module.exports = {sendToken, sendSellerToken, sendAdminToken}