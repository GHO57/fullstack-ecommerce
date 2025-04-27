const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
    addToWishlist,
    removeFromWishlist,
    getAllProducts,
} = require("../controllers/wishlistController");

//add wishlist product
router.route("/add").post(isAuthenticated, addToWishlist);
//remove wishlist product
router.route("/remove/:product_id").delete(isAuthenticated, removeFromWishlist);

//get all wishlist products
router.route("/getallproducts").get(isAuthenticated, getAllProducts);

module.exports = router;
