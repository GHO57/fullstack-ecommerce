const express = require("express")
const router = express.Router()
const { getkey, checkout, paymentVerification } = require("../controllers/paymentController")
const { isAuthenticated } = require("../middleware/auth")

//create order in razor pay while checking out
router.route('/checkout').post(isAuthenticated, checkout)

//check and insert record in orders table
router.route('/verification').post(isAuthenticated, paymentVerification)

//get razorpay key
router.route('/getkey').get(isAuthenticated, getkey)

module.exports = router