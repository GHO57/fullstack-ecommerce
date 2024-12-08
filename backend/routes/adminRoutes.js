const express = require("express");
const router = express.Router();
const {
    getallusers,
    changeAdminRole,
    deleteUser,
    addNewAdmin,
    getalladmins,
    getAllsellers,
    adminLogin,
    deleteAdmin,
    logout,
    getAdminDetails,
    approveSeller,
    rejectSeller,
    getSellerApplications,
    deleteSeller,
} = require("../controllers/adminController");
const { getStats } = require("../controllers/adminController");
const { isAdminAuthenticated, authorizeRoles } = require("../middleware/auth");
const { validateEmail, validateLogin, validateAll } = require("../middleware/validation");

//admin login
router.route("/login").post(validateLogin, adminLogin);

//admin logout
router.route("/logout").post(isAdminAuthenticated, logout);

//admin dashboard
router.route("/dashboard").get(isAdminAuthenticated, getAdminDetails);

//get all users
router.route("/getallusers").get(isAdminAuthenticated, authorizeRoles("admin"), getallusers);

//get all sellers
router.route("/getallsellers").get(isAdminAuthenticated, authorizeRoles("admin"), getAllsellers);

//get all pending seller applications
router
    .route("/getsellerapplications")
    .get(isAdminAuthenticated, authorizeRoles("admin"), getSellerApplications);

//get all admins
router.route("/getalladmins").get(isAdminAuthenticated, authorizeRoles("admin"), getalladmins);

//change admin role
router
    .route("/changeadminrole")
    .post(validateEmail, isAdminAuthenticated, authorizeRoles("admin"), changeAdminRole);

//add new admin
router.route("/addadmin").post(isAdminAuthenticated, authorizeRoles("admin"), addNewAdmin);

//delete admin
router
    .route("/deleteadmin/:admin_id")
    .delete(isAdminAuthenticated, authorizeRoles("admin"), deleteAdmin);

//delete user
router
    .route("/deleteuser/:user_id")
    .delete(isAdminAuthenticated, authorizeRoles("admin"), deleteUser);

//delete seller
router
    .route("/deleteseller/:seller_id")
    .delete(isAdminAuthenticated, authorizeRoles("admin"), deleteSeller);

//approve seller application
router
    .route("/approveseller")
    .post(validateAll, isAdminAuthenticated, authorizeRoles("admin"), approveSeller);

//reject seller application
router
    .route("/rejectseller")
    .post(validateAll, isAdminAuthenticated, authorizeRoles("admin"), rejectSeller);

//admin stats
router.route("/stats").get(validateAll, isAdminAuthenticated, authorizeRoles("admin"), getStats);

module.exports = router;
