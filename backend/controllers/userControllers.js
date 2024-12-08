const { pool } = require("../config/database");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendMail");
const errorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/jwtToken");

//generate uuid

const generate_uuid = () => {
    return uuidv4();
};

//generate random 6 digit otp

const generate_otp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

//validate fullname

const validateFullname = (fullname) => {
    // Fullname should only contain letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(fullname);
};

//send otp to target mail

exports.sendOTP = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new errorHandler("Enter an email", 400));
    }

    const OTP = generate_otp();
    const subject = "Login/Signup OTP";
    const message = `Your OTP is ${OTP}`;
    const [existingOTP] = await pool.execute("SELECT otp from userotps WHERE email = ?", [email]);

    if (existingOTP.length > 0) {
        await pool.execute("UPDATE userotps SET otp = ? WHERE email = ?", [OTP, email]);
    } else {
        const uuid = generate_uuid();
        if (email) {
            await pool.execute("INSERT INTO userotps VALUES(?, ?, ?)", [uuid, email, OTP]);
        }
    }

    try {
        sendEmail({
            email,
            subject,
            message,
        });

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email}`,
        });
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

// login/signup using only email

exports.loginsignup = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!otp) {
        return next(new errorHandler("Enter the OTP", 400));
    }

    if (!email) {
        return next(new errorHandler("Enter the email", 400));
    }

    try {
        const [db_otp] = await pool.execute("SELECT otp FROM userotps WHERE email = ?", [email]);

        if (parseInt(otp) === db_otp[0].otp) {
            const [existingUser] = await pool.execute("SELECT * FROM users WHERE email = ?", [
                email,
            ]);

            if (existingUser.length > 0 && existingUser[0].fullname !== null) {
                const [cart] = await pool.execute("SELECT id FROM carts WHERE user_id = ?", [
                    existingUser[0].id,
                ]);

                sendToken(existingUser, cart[0].id, 201, res);
            } else if (existingUser.length === 0) {
                const uuid = generate_uuid();

                await pool.execute("INSERT INTO users (id, email) VALUES(?, ?)", [uuid, email]);

                const [newUser] = await pool.execute("SELECT * FROM users WHERE email = ?", [
                    email,
                ]);

                res.status(201).json({
                    success: true,
                    message: "user created without fullname",
                    newUser,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "user exists without fullname",
                    newUser: existingUser,
                });
            }
        } else {
            return next(new errorHandler("Invalid OTP", 400));
        }
    } catch (error) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//get user's full name if he/she is a new user

exports.signupNewUser = catchAsyncErrors(async (req, res, next) => {
    const { email, fullname } = req.body;

    if (!fullname) {
        return next(new errorHandler("Enter fullname", 400));
    }

    if (!email) {
        return next(new errorHandler("Enter the email", 400));
    }

    const trimmedFullname = fullname.trim();
    const validation = validateFullname(trimmedFullname);

    if (!validation) {
        return next(new errorHandler(`Invalid Full name`, 400));
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.execute("UPDATE users SET fullname = ? WHERE email = ?", [
            trimmedFullname,
            email,
        ]);

        const [user] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        const cartId = generate_uuid();

        await connection.execute("INSERT INTO carts (id, user_id) VALUES (? ,?)", [
            cartId,
            user[0].id,
        ]);

        await connection.commit();

        sendToken(user, cartId, 201, res);
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        return next(new errorHandler(`Something Went Wrong`, 500));
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

//logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("AUTHCOOKIE", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).cookie("CARTID", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

//get user details (dashboard)

exports.getuserdetails = catchAsyncErrors(async (req, res, next) => {
    const { userId, cartId } = req.user[0][0];

    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
        const [deliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ? AND is_deleted = 0",
            [userId]
        );
        const [allDeliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ?",
            [userId]
        );

        if (user.length > 0) {
            res.status(200).json({
                success: true,
                user,
                deliveryAddress,
                allDeliveryAddress,
                cartId,
            });
        } else {
            return next(new errorHandler("User not found", 404));
        }
    } catch (err) {
        return next(new errorHandler(`Something Went Wrong`, 500));
    }
});

// add new delivery address

exports.addDeliveryAddress = catchAsyncErrors(async (req, res, next) => {
    const {
        fullname,
        phone_number,
        alternate_phone_number,
        pincode,
        state,
        city,
        landmark,
        address,
    } = req.body;
    const { userId } = req.user[0][0];

    if (!fullname || !phone_number || !pincode || !state || !city || !address) {
        return next(new errorHandler("Enter all required the fields", 400));
    }

    try {
        const uuid = generate_uuid();
        await pool.execute(
            "INSERT INTO delivery_address (id, user_id, fullname, mobile_number, alternate_phone_number, pincode, address, city, state, landmark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                uuid,
                userId,
                fullname,
                phone_number,
                alternate_phone_number,
                pincode,
                address,
                city,
                state,
                landmark,
            ]
        );
        const [deliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ? AND is_deleted = 0",
            [userId]
        );
        const [allDeliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ?",
            [userId]
        );

        res.status(200).json({
            success: true,
            message: "Address added successfully",
            deliveryAddress,
            allDeliveryAddress,
        });
    } catch (error) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

// delete new delivery address

exports.deleteDeliveryAddress = catchAsyncErrors(async (req, res, next) => {
    const { address_id } = req.body;
    const { userId } = req.user[0][0];

    if (!address_id) {
        return next(new errorHandler("Address cannot be deleted", 400));
    }

    try {
        await pool.execute(
            "UPDATE delivery_address SET is_deleted = 1 WHERE id = ? AND user_id = ?",
            [address_id, userId]
        );
        const [deliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ? AND is_deleted = 0",
            [userId]
        );
        const [allDeliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ?",
            [userId]
        );

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            deliveryAddress,
            allDeliveryAddress,
        });
    } catch (error) {
        return next(new errorHandler(`Something went wrong ${error}`, 500));
    }
});

//update user

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const { email, fullname } = req.body;

    if (!fullname) {
        return next(new errorHandler("Enter fullname", 400));
    }

    if (!email) {
        return next(new errorHandler("Enter the email", 400));
    }

    const trimmedFullname = fullname.trim();
    const validation = validateFullname(trimmedFullname);

    try {
        if (validation) {
            await pool.execute("UPDATE users SET fullname = ? WHERE email = ?", [
                trimmedFullname,
                email,
            ]);

            const [user] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

            res.status(200).json({
                success: true,
                message: "Name updated successfully",
                user,
            });
        } else {
            return next(new errorHandler(`Invalid Full name`, 400));
        }
    } catch (err) {
        return next(new errorHandler(`Something Went Wrong`, 500));
    }
});

//get all orders

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.user[0][0];

    if (!userId) {
        return next(new errorHandler("You're not logged in", 400));
    }

    try {
        const [orders] = await pool.execute(
            "SELECT * FROM orders WHERE user_id = ? AND payment_status IS NOT NULL AND payment_id IS NOT NULL",
            [userId]
        );
        const [deliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ? AND is_deleted = 0",
            [userId]
        );
        const [allDeliveryAddress] = await pool.execute(
            "SELECT * FROM delivery_address WHERE user_id = ?",
            [userId]
        );

        if (orders.length > 0) {
            res.status(200).json({
                success: true,
                orders,
                deliveryAddress,
                allDeliveryAddress,
            });
        } else {
            return next(new errorHandler("No Orders Found", 404));
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500));
    }
});

//get order items by order id

exports.getOrderItems = catchAsyncErrors(async (req, res, next) => {
    const { order_id } = req.params;

    if (!order_id) {
        return next(new errorHandler("Order id not provided", 400));
    }

    try {
        const [orderItems] = await pool.execute(
            "SELECT oi.id, oi.order_id, oi.product_id, oi.seller_id, oi.quantity, oi.price, oi.mrp, oi.product_status, p.image_url, p.name FROM order_items oi, products p WHERE oi.product_id = p.id AND order_id = ?",
            [order_id]
        );
        if (orderItems.length > 0) {
            res.status(200).json({
                success: true,
                orderItems,
            });
        } else {
            return next(new errorHandler("Order Not Found", 404));
        }
    } catch (error) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

// update Delivery Address
exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
    // const {id, fullname, mobile_number, alternate_phone_number, pincode, state, city, landmark, address } = req.body;
    const { id, ...updateFields } = req.body;
    const { userId } = req.user[0][0];

    // if (!fullname || !mobile_number || !pincode || !state || !city || !address) {
    //     return next(new errorHandler("Enter all required fields", 400));
    // }

    // try {
    //     await pool.execute('UPDATE delivery_address SET fullname = ?, mobile_number = ?, alternate_phone_number = ?, pincode = ?, address = ?, city = ?, state = ?, landmark = ? WHERE id = ?',
    //         [fullname, mobile_number, alternate_phone_number, pincode, address, city, state, landmark, id]);
    try {
        const fields = Object.keys(updateFields)
            .map((field) => `${field} = ?`)
            .join(", ");
        const values = Object.values(updateFields);

        if (fields) {
            await pool.execute(`UPDATE delivery_address SET ${fields} WHERE id = ?`, [
                ...values,
                id,
            ]);
            const [deliveryAddress] = await pool.execute(
                "SELECT * FROM delivery_address WHERE user_id = ? AND is_deleted = 0",
                [userId]
            );
            const [allDeliveryAddress] = await pool.execute(
                "SELECT * FROM delivery_address WHERE user_id = ?",
                [userId]
            );

            res.status(200).json({
                success: true,
                message: "Address updated successfully",
                deliveryAddress,
                allDeliveryAddress,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500));
    }
});
