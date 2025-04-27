const express = require("express");
const { getAllProducts, getProductDetails } = require("../controllers/productController");
const router = express.Router();

//get all products
router.route("/getallproducts").get(getAllProducts);

//get product details
router.route("/getdetails/:product_id").get(getProductDetails);

module.exports = router;
