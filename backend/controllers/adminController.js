const { pool } = require("../config/database");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const errorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");
const { sendAdminToken } = require("../utils/jwtToken");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

//generate random uuid

const generate_uuid = () => {
    return uuidv4();
};

//generate random password of 20 length

const generateRandomPassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charset.length);
        password += charset[randomIndex];
    }
    return password;
};

//admin operations on users

//admin login

exports.adminLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorHandler("Enter all the required fields", 400));
    }

    const [admin] = await pool.execute("SELECT * FROM admins WHERE email = ?", [email]);
    const [pass] = await pool.execute("SELECT password FROM admins WHERE email = ?", [email]);

    if (admin.length > 0) {
        const isMatch = await bcrypt.compare(password, pass[0].password);

        if (isMatch) {
            sendAdminToken(admin, 201, res);
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Invalid email or password",
        });
    }
});

//logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("ADMINAUTHCOOKIE", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Admin Logged Out",
    });
});

//get admin details (dashboard)

exports.getAdminDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.user[0][0];

    try {
        const [adminUser] = await pool.execute("SELECT * FROM admins WHERE id = ?", [id]);

        if (adminUser.length > 0) {
            res.status(200).json({
                success: true,
                adminUser,
            });
        } else {
            return next(new errorHandler("Admin not found", 404));
        }
    } catch (err) {
        console.log(err);
        return next(new errorHandler("Something went wrong", 500));
    }
});

//get all users

exports.getallusers = catchAsyncErrors(async (req, res, next) => {
    try {
        const [users] = await pool.execute("SELECT * FROM users");

        if (users.length > 0) {
            res.status(200).json({
                success: true,
                users,
            });
        } else {
            return next(new errorHandler("No users", 404));
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//get all sellers

exports.getAllsellers = catchAsyncErrors(async (req, res, next) => {
    try {
        const [sellers] = await pool.execute("SELECT * FROM sellers");

        if (sellers.length > 0) {
            res.status(200).json({
                success: true,
                sellers,
            });
        } else {
            return next(new errorHandler("No sellers", 404));
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//get all pending seller applications

exports.getSellerApplications = catchAsyncErrors(async (req, res, next) => {
    try {
        const [pendingSellers] = await pool.execute(
            'SELECT * FROM seller_applications WHERE status = "pending"'
        );

        if (pendingSellers.length > 0) {
            res.status(200).json({
                success: true,
                pendingSellers,
            });
        } else {
            return next(new errorHandler("No seller applications", 404));
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//get all admins

exports.getalladmins = catchAsyncErrors(async (req, res, next) => {
    try {
        const [admins] = await pool.execute("SELECT * FROM admins");

        if (admins.length > 0) {
            res.status(200).json({
                success: true,
                admins,
            });
        } else {
            return next(new errorHandler("No admins", 404));
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//change admin role

exports.changeAdminRole = catchAsyncErrors(async (req, res, next) => {
    const { email, role } = req.body;

    if (!email) {
        return next(new errorHandler("Enter the Email", 400));
    }

    const [previousRole] = await pool.execute("SELECT role from admins WHERE email = ?", [email]);

    try {
        if (previousRole[0].role === role) {
            return next(new errorHandler(`already in '${role}' role`, 400));
        } else {
            await pool.execute("UPDATE admins SET role = ? WHERE email = ?", [role, email]);
            const [adminUsers] = await pool.execute("SELECT * FROM admins");
            res.status(200).json({
                success: true,
                message: `Role updated to '${role}'`,
                adminUsers,
            });
        }
    } catch (err) {
        return next(new errorHandler("No admin found with this email", 404));
    }
});

//add new admin

exports.addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { fullname, email, role } = req.body;

    if (!email || !fullname || !role) {
        return next(new errorHandler("Enter all the required inputs", 400));
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingAdmin] = await connection.execute("SELECT * FROM admins WHERE email = ?", [
            email,
        ]);

        if (existingAdmin.length > 0) {
            return next(new errorHandler("Admin already exist", 400));
        } else {
            const uuid = generate_uuid();
            const password = generateRandomPassword(20);
            const hashedPassword = await bcrypt.hash(password, 10);
            const message = `You have been added as ${role}
                               path: /admin/login
                               password: ${password}
                            `;
            await connection.execute(
                "INSERT INTO admins (id, fullname, role, email, password) VALUES(?, ?, ?, ?, ?)",
                [uuid, fullname, role, email, hashedPassword]
            );
            const [adminUser] = await connection.execute("SELECT * FROM admins WHERE id = ?", [
                uuid,
            ]);

            try {
                await sendEmail({
                    email,
                    subject: "Admin password",
                    message,
                });

                await connection.commit();

                res.status(200).json({
                    success: true,
                    message: `New ${role} added and email sent successfully`,
                    adminUser: adminUser[0],
                });
            } catch (err) {
                await connection.rollback();
                return next(new errorHandler("Something went wrong", 500));
            }
        }
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        return next(new errorHandler("Something went wrong", 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

//delete admin

exports.deleteAdmin = catchAsyncErrors(async (req, res, next) => {
    const { admin_id } = req.params;

    if (!admin_id) {
        return next(new errorHandler("Enter the id.", 400));
    }

    try {
        const [admin] = await pool.execute("SELECT * FROM admins WHERE id = ?", [admin_id]);

        if (admin.length > 0) {
            await pool.execute("DELETE FROM admins WHERE id = ?", [admin_id]);

            res.status(200).json({
                success: true,
                message: "Admin successfully deleted",
                adminId: admin_id,
            });
        } else {
            return next(new errorHandler("Admin doesn't exist", 404));
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500));
    }
});

//delete user

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const { user_id } = req.params;

    if (!user_id) {
        return next(new errorHandler("Enter the id", 400));
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [user] = await connection.execute(
            "SELECT u.id as userId, u.fullname, u.email, c.id as cartId FROM users u, carts c WHERE c.user_id = u.id && u.id = ?",
            [user_id]
        );

        if (user.length > 0) {
            await connection.execute("DELETE FROM cart_items WHERE cart_id = ?", [user[0].cartId]);
            await connection.execute("DELETE FROM carts WHERE user_id = ?", [user[0].userId]);
            await connection.execute("DELETE FROM users WHERE id = ?", [user[0].userId]);

            await connection.commit();

            res.status(200).json({
                success: true,
                message: "User successfully deleted",
                userId: user_id,
            });
        } else {
            await connection.rollback();
            return next(new errorHandler("User doesn't exist", 404));
        }
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        return next(new errorHandler("Something went wrong", 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

//delete seller

exports.deleteSeller = catchAsyncErrors(async (req, res, next) => {
    const { seller_id } = req.params;

    if (!seller_id) {
        return next(new errorHandler("Enter the id", 400));
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [seller] = await connection.execute("SELECT * FROM sellers WHERE id = ?", [
            seller_id,
        ]);

        if (seller.length > 0) {
            await connection.execute("DELETE FROM products WHERE seller_id = ?", [seller_id]);
            await connection.execute("DELETE FROM sellers WHERE id = ?", [seller_id]);

            await connection.commit();

            res.status(200).json({
                success: true,
                message: "Seller successfully deleted",
                sellerId: seller_id,
            });
        } else {
            await connection.rollback();
            return next(new errorHandler("Seller doesn't exist", 404));
        }
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        return next(new errorHandler(`Something went wrong ${error}`, 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

//approve seller application

exports.approveSeller = catchAsyncErrors(async (req, res, next) => {
    const { email, gstin } = req.body;

    if (!email || !gstin) {
        return next(new errorHandler("Enter all the required details", 400));
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingSeller] = await connection.execute(
            "SELECT * FROM sellers WHERE gstin = ? || email = ?",
            [gstin, email]
        );

        if (existingSeller.length > 0) {
            return next(new errorHandler("Seller Already Approved", 400));
        } else {
            const [appliedSeller] = await connection.execute(
                "SELECT * FROM seller_applications WHERE gstin = ? && email= ?",
                [gstin, email]
            );
            if (appliedSeller.length > 0) {
                const uuid = generate_uuid();
                const password = generateRandomPassword(20);
                const sellerHashedPassword = await bcrypt.hash(password, 10);
                const message = `You're GSTIN has been approved and you can sell products 
                                   login credentials:
                                   email: your_email
                                   password: ${password}
                                   `;
                console.log(password);
                await connection.execute(
                    "DELETE FROM seller_applications WHERE gstin = ? && email = ?",
                    [gstin, email]
                );
                await connection.execute(
                    "INSERT INTO sellers (id, full_name, email, password, company_name, company_address, gstin) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [
                        uuid,
                        appliedSeller[0].full_name,
                        appliedSeller[0].email,
                        sellerHashedPassword,
                        appliedSeller[0].company_name,
                        appliedSeller[0].company_address,
                        appliedSeller[0].gstin,
                    ]
                );

                try {
                    await sendEmail({
                        email,
                        subject: "SELLER APPROVED",
                        message,
                    });

                    await connection.commit();

                    res.status(200).json({
                        success: true,
                        message: `Seller approved and email sent successfully`,
                        applicationId: appliedSeller[0].id,
                    });
                } catch (err) {
                    await connection.rollback();
                    return next(new errorHandler(err.message, 500));
                }
            } else {
                await connection.rollback();
                return next(new errorHandler("Seller didn't apply", 400));
            }
        }
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        return next(new errorHandler(`Something went wrong`, 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

//reject seller application

exports.rejectSeller = catchAsyncErrors(async (req, res, next) => {
    const { email, gstin } = req.body;

    if (!email || !gstin) {
        return next(new errorHandler("Enter all the required details", 400));
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingSeller] = await connection.execute(
            "SELECT * FROM sellers WHERE gstin = ? || email = ?",
            [gstin, email]
        );

        if (existingSeller.length > 0) {
            return next(new errorHandler("Seller Already Approved", 400));
        } else {
            const [appliedSeller] = await connection.execute(
                "SELECT * FROM seller_applications WHERE gstin = ? && email = ?",
                [gstin, email]
            );
            if (appliedSeller.length > 0) {
                const message = `You're GSTIN is Invalid, please verify your GSTIN and reapply`;

                await connection.execute(
                    "DELETE FROM seller_applications WHERE gstin = ? && email = ?",
                    [gstin, email]
                );

                try {
                    await sendEmail({
                        email,
                        subject: "SELLER REJECTED",
                        message,
                    });

                    await connection.commit();

                    res.status(200).json({
                        success: true,
                        message: `Seller rejected and email sent successfully`,
                        applicationId: appliedSeller[0].id,
                    });
                } catch (err) {
                    await connection.rollback();
                    return next(new errorHandler(err.message, 500));
                }
            } else {
                await connection.rollback();
                return next(new errorHandler("Seller didn't apply", 400));
            }
        }
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        return next(new errorHandler("Something went wrong", 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

const getTotalRevenue = async () => {
    const [rows] = await pool.execute("SELECT SUM(total) as totalRevenue FROM orders");
    return rows[0].totalRevenue;
};

const getTotalProducts = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) as totalProducts FROM products");
    return rows[0].totalProducts;
};

const getTotalSellers = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) as totalSellers FROM sellers");
    return rows[0].totalSellers;
};

const getTotalOrders = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) as totalOrders FROM orders");
    return rows[0].totalOrders;
};

const getTotalUsers = async () => {
    const [rows] = await pool.execute("SELECT COUNT(*) as totalUsers FROM users");
    return rows[0].totalUsers;
};

const getTotalPendingOrders = async () => {
    const [rows] = await pool.execute(
        "SELECT COUNT(*) as totalPendingOrders FROM orders WHERE status = ? ",
        ["Pending"]
    );
    return rows[0].totalPendingOrders;
};

exports.getStats = catchAsyncErrors(async (req, res, next) => {
    try {
        const totalRevenue = await getTotalRevenue();
        const totalProducts = await getTotalProducts();
        const totalSellers = await getTotalSellers();
        const totalOrders = await getTotalOrders();
        const totalUsers = await getTotalUsers();
        const totalPendingOrders = await getTotalPendingOrders();

        res.status(200).json({
            totalRevenue,
            totalProducts,
            totalSellers,
            totalOrders,
            totalUsers,
            totalPendingOrders,
        });
    } catch (err) {
        return next(new errorHandler("Something went wrong", 500));
    }
});
