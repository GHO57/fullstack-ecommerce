const { validationResult, check } = require('express-validator')
const errorHandler = require("../utils/errorHandler")

exports.validateEmail = [
    check('email', 'Invalid email address')
        .trim()
        .isEmail()
        .not()
        .isEmpty(),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]

exports.validateLogin = [
    check('email', 'Invalid email or password')
        .trim()
        .isEmail()
        .not()
        .isEmpty(),

    check('password', 'Invalid email or password')
        .trim()
        .not()
        .isEmpty(),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]

exports.validateUserLogin = [
    check('email', 'Invalid email address')
        .trim()
        .isEmail()
        .not()
        .isEmpty(),
    check('otp', 'Invalid OTP')
        .trim()
        .isNumeric()
        .not()
        .isEmpty()
        .isLength({ min: 6, max: 6 }),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]

exports.validateUserSignup = [
    check('email', 'Invalid email address')
        .trim()
        .isEmail()
        .not()
        .isEmpty(),
    check('fullname', 'Invalid Full name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .not()
        .isNumeric()
        .isString(),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]

exports.validateSellerApplication = [
        check('fullname', 'Invalid Full name')
            .trim()
            .escape()
            .isString()
            .not()
            .isEmpty()
            .not()
            .isNumeric(),
        check('email', 'Invalid email address')
            .trim()
            .isEmail()
            .not()
            .isEmpty(),
        // check('phone', 'Invalid phone number')
        //     .isNumeric()
        //     .not()
        //     .isEmpty()
        //     .not()
        //     .isString()
        //     .isLength({ min: 10, max: 10 }),
        check('gstin', 'Invalid GSTIN')
            .isNumeric()
            .not()
            .isEmpty()
            .isLength({ min: 15, max: 15 }),
        check('companyname', 'Invalid company name')
            .trim()
            .escape()
            .isString()
            .not()
            .isEmpty(),
        check('companyaddress', 'Invalid company address')
            .trim()
            .escape()
            .isString()
            .not()
            .isEmpty(),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]

exports.validateSellerProducts = [
    check('public_id_object', 'no products selected')
        .isObject()
        .not()
        .isEmpty(),

    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]

exports.validateAll = [
        check('fullname', 'Invalid Full name')
            .optional()
            .trim()
            .isString()
            .not()
            .isEmpty()
            .not()
            .isNumeric()
            .not()
            .isAlphanumeric(),
        check('email', 'Invalid email address')
            .optional()
            .trim()
            .isEmail()
            .not()
            .isEmpty(),
        check('otp', 'Invalid OTP')
            .optional()
            .isNumeric()
            .not()
            .isEmpty()
            .isLength({ min: 6, max: 6 }),
        check('phone', 'Invalid phone number')
            .optional()
            .isNumeric()
            .not()
            .isEmpty()
            .not()
            .isString()
            .isLength({ min: 10, max: 10 }),
        check('gstin', 'Invalid GSTIN')
            .optional()
            .isNumeric()
            .not()
            .isEmpty()
            .isLength({ min: 15, max: 15 }),

        check('companyname', 'Invalid company name')
            .optional()
            .trim()
            .isString()
            .not()
            .isEmpty(),
        check('companyaddress', 'Invalid company address')
            .optional()
            .trim()
            .isString()
            .not()
            .isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new errorHandler(errors.array()[0].msg, 400))
        }

        next()
    }
]