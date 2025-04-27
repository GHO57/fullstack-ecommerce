const { pool } = require("../config/database");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const errorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");

//generate uuid
const generate_uuid = () => {
    return uuidv4();
};

//add product to wishlist

exports.addToWishlist = catchAsyncErrors(async (req, res, next) => {
    const { product_id } = req.body;
    const { userId } = req.user[0][0];

    try {
        const [existingProduct] = await pool.execute(
            "SELECT * FROM wishlist WHERE product_id = ? AND user_id = ?",
            [product_id, userId]
        );
        const [isValidProduct] = await pool.execute("SELECT * FROM products WHERE id = ?", [
            product_id,
        ]);

        if (isValidProduct.length === 0) {
            return next(new errorHandler("Invalid product", 400));
        }

        if (existingProduct.length === 0) {
            const uuid = generate_uuid();

            await pool.execute("INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)", [
                uuid,
                userId,
                product_id,
            ]);
            const [wishlistProducts] = await pool.execute(
                "SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE user_id = ?",
                [userId]
            );
            res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                wishlistProducts: wishlistProducts,
                numberOfProducts: wishlistProducts.length,
            });
        } else {
            return next(new errorHandler("Product already in wishlist", 400));
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//remove product from wishlist

exports.removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
    const { product_id } = req.params;
    const { userId } = req.user[0][0];

    try {
        const [result] = await pool.execute(
            "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
            [userId, product_id]
        );
        const [wishlistProducts] = await pool.execute(
            "SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE user_id = ?",
            [userId]
        );
        if (result.affectedRows === 1) {
            res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
                wishlistProducts: wishlistProducts,
                numberOfProducts: wishlistProducts.length,
            });
        } else {
            return next(new errorHandler("Invalid Product", 400));
        }
    } catch (err) {
        return next(new errorHandler("Something went wrong", 500));
    }
});

//view all wishlist products

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.user[0][0];

    try {
        const [wishlistProducts] = await pool.execute(
            "SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE user_id = ?",
            [userId]
        );

        res.status(200).json({
            success: true,
            wishlistProducts: wishlistProducts,
            numberOfProducts: wishlistProducts.length,
        });
    } catch (err) {
        return next(new errorHandler("Something went wrong", 500));
    }
});
