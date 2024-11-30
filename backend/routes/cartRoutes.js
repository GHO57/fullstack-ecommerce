const express = require("express")
const router = express.Router()
const { addToCart, removeFromCart, getCartItems, deleteItemFromCart, clearCart, validateCart } = require("../controllers/cartController")
const { isAuthenticated, authorizeRoles } = require("../middleware/auth")
const { validateEmail } = require("../middleware/validation")

router.route("/additem").post(isAuthenticated, addToCart)

router.route("/removeitem").post(isAuthenticated, removeFromCart)

router.route("/getitems").get(isAuthenticated, getCartItems)

router.route("/delete").post(isAuthenticated, deleteItemFromCart)

router.route("/validate").post(isAuthenticated, validateCart)

router.route("/clear").post(isAuthenticated, clearCart)

module.exports = router