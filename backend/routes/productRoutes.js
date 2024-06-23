const express = require('express')
const { getAllProducts, getProductDetails } = require('../controllers/productController')
const router = express.Router()


//get all products
router.route("/getallproducts").get(getAllProducts)

//get product details
router.route("/getproductdetails").get(getProductDetails)

module.exports = router