const express = require("express");
const router = express.Router();
const {
    sellerApplication,
    sellerLogin,
    sellerLogout,
    addProduct,
    getSellerDetails,
    deleteProduct,
    updateProductDetails,
    getProducts,
    getProductDetails,
    deleteMultipleProducts,
    restoreProduct,
    restoreMultipleProducts,
    getAllOrdersBySellerId,
    getOrderItemsBySellerId,
    updateOrderItemStatus,
    getSellerOrders,
    getDeletedProducts,
} = require("../controllers/sellerController");
const { isSellerAuthenticated } = require("../middleware/auth");
const uploadImage = require("../middleware/imageUpload");
const {
    validateEmail,
    validateLogin,
    validateSellerApplication,
    validateSellerProducts,
    validateAll,
} = require("../middleware/validation");

//seller application
router.route("/apply").post(validateSellerApplication, sellerApplication);

//seller login
router.route("/login").post(validateLogin, sellerLogin);

//seller logout
router.route("/logout").post(isSellerAuthenticated, sellerLogout);

//seller dashboard
router.route("/dashboard").get(isSellerAuthenticated, getSellerDetails);

//seller orders
router.route("/getsellerorders").get(isSellerAuthenticated, getSellerOrders);

//add product
router.route("/addproduct").post(isSellerAuthenticated, uploadImage, addProduct);

//delete product
router.route("/deleteproduct/:public_id").delete(isSellerAuthenticated, deleteProduct);

//delete multiple products -- delete
router.route("/deleteproducts").delete(isSellerAuthenticated, deleteMultipleProducts);

//delete multiple products -- post
router.route("/deleteproducts").post(isSellerAuthenticated, deleteMultipleProducts);

//restore product
router.route("/restoreproduct/:product_id").put(isSellerAuthenticated, restoreProduct);

//restore multiple products -- delete
router.route("/restoreproducts").put(isSellerAuthenticated, restoreMultipleProducts);

//restore multiple products -- post
router.route("/restoreproducts").post(isSellerAuthenticated, restoreMultipleProducts);

//update product details
router.route("/updateproduct").put(isSellerAuthenticated, uploadImage, updateProductDetails);

//get products
router.route("/getproducts").get(isSellerAuthenticated, getProducts);

//get deleted products
router.route("/getdeletedproducts").get(isSellerAuthenticated, getDeletedProducts);

//get product details
router.route("/getproductdetails/:product_id").get(isSellerAuthenticated, getProductDetails);

//get all orders by seller id
router.route("/orders").get(isSellerAuthenticated, getAllOrdersBySellerId);

//get all order items by seller id and order id
router.route("/order/items/:order_id").get(isSellerAuthenticated, getOrderItemsBySellerId);

//update order item status
router.route("/order/item/updatestatus").post(isSellerAuthenticated, updateOrderItemStatus);

module.exports = router;
