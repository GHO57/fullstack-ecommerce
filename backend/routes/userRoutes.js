const express = require("express")
const router = express.Router()
const { sendOTP, loginsignup, logout, updateUser, getuserdetails, signupNewUser, addDeliveryAddress, deleteDeliveryAddress, getAllOrders, getOrderItems, updateAddress } = require("../controllers/userControllers")
const { isAuthenticated } = require("../middleware/auth")
const { validateEmail, validateUserLogin, validateUserSignup, validateAll } = require("../middleware/validation") 

//send otp to user email
router.route("/sendotp").post(validateEmail, sendOTP)

//login/signup
router.route("/loginsignup").post(validateUserLogin, loginsignup)

//get fullname for new user for signup
router.route("/signupuser").post(validateUserSignup, signupNewUser)

//logout
router.route("/logout").post(isAuthenticated, logout)

//add delivery address
router.route("/adddeliveryaddress").post(isAuthenticated, addDeliveryAddress)

//delete delivery address
router.route("/deletedeliveryaddress").post(isAuthenticated, deleteDeliveryAddress)

//dashboard (get user details)
router.route("/dashboard").get(isAuthenticated, getuserdetails)

//update the user information
router.route("/updateUser").post(isAuthenticated, updateUser)

//get all orders
router.route("/orders").get(isAuthenticated, getAllOrders)

//get order items by order id
router.route("/order/items/:order_id").get(isAuthenticated, getOrderItems)

//update the user address
router.route("/updateAddress").post(isAuthenticated, updateAddress)


module.exports = router