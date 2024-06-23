const express = require("express")
const router = express.Router()
const { addToCart, removeFromCart, getCartItems, deleteItemFromCart, clearCart } = require("../controllers/cartController")
const { isAuthenticated, authorizeRoles } = require("../middleware/auth")

router.route("/additem").post(isAuthenticated, addToCart)

router.route("/removeitem").post(isAuthenticated, removeFromCart)

router.route("/getitems").get(isAuthenticated, getCartItems)

router.route("/delete").post(isAuthenticated, deleteItemFromCart)

router.route("/clear").post(isAuthenticated, clearCart)

module.exports = router