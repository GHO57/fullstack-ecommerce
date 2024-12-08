const { pool } = require("../config/database");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const { v4: uuidv4 } = require("uuid");
const errorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//generate random uuid

const generate_uuid = () => {
    return uuidv4();
};

const calculatePriceAndMRP = (cartItems) => {
    let totalPrice = 0;
    let totalMRP = 0;
    let totalValidProducts = 0;

    for (i = 0; i < cartItems.length; i++) {
        if (cartItems[i].is_deleted === 0 && cartItems[i].stock > 0) {
            totalPrice = totalPrice + cartItems[i].price * cartItems[i].quantity;
            totalMRP = totalMRP + cartItems[i].mrp * cartItems[i].quantity;
            totalValidProducts++;
        }
    }

    return { totalPrice, totalMRP, totalValidProducts };
};

//add/update to cart

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
    const { product_id } = req.body;
    const { cartId } = req.user[0][0];

    try {
        const [productInfo] = await pool.execute("SELECT * FROM products WHERE id = ?", [
            product_id,
        ]);
        if (productInfo.length <= 0) {
            return next(new errorHandler("Invalid product ID", 400));
        }
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_items WHERE cart_id = ? && product_id = ?",
            [cartId, productInfo[0].id]
        );
        const stock = productInfo[0].stock;

        if (stock > 0) {
            //checks whether the stock is greated than 0
            if (cartProduct.length <= 0) {
                //checks whether the cart has this product in it
                const uuid = generate_uuid();

                await pool.execute(
                    "INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES (?, ?, ?, 1)",
                    [uuid, cartId, productInfo[0].id]
                );
                const [cartItems] = await pool.execute(
                    "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
                    [cartId]
                );

                const totalItems = cartItems.length;

                const { totalPrice, totalMRP, totalValidProducts } =
                    calculatePriceAndMRP(cartItems);

                res.status(201).json({
                    success: true,
                    message: `${productInfo[0].name} added successfully to the cart`,
                    cartItems,
                    totalItems,
                    totalPrice,
                    totalMRP,
                    totalValidProducts,
                });
            } else {
                //updates the quantity of the existing product in the cart
                let quantity = cartProduct[0].quantity + 1;

                if (stock > quantity - 1) {
                    await pool.execute(
                        "UPDATE cart_items SET quantity = ? WHERE cart_id = ? && product_id = ?",
                        [quantity, cartId, productInfo[0].id]
                    );
                    const [cartItems] = await pool.execute(
                        "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
                        [cartId]
                    );

                    const totalItems = cartItems.length;

                    const { totalPrice, totalMRP, totalValidProducts } =
                        calculatePriceAndMRP(cartItems);

                    res.status(200).json({
                        success: true,
                        message: `updated ${productInfo[0].name}'s quantity to ${quantity}`,
                        cartItems,
                        totalItems,
                        totalPrice,
                        totalMRP,
                        totalValidProducts,
                    });
                } else {
                    return next(
                        new errorHandler(
                            `Sorry only ${stock} ${productInfo[0].name} were available.`
                        )
                    );
                }
            }
        } else {
            //returns response as out of stock
            res.status(200).json({
                success: true,
                message: `${productInfo[0].name} is Out of Stock`,
            });
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//remove from cart

exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
    const { product_id } = req.body;
    const { cartId } = req.user[0][0];

    try {
        const [productInfo] = await pool.execute("SELECT * FROM products WHERE id = ?", [
            product_id,
        ]);
        if (productInfo.length <= 0) {
            return next(new errorHandler("Invalid product ID", 400));
        }
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_items WHERE cart_id = ? && product_id = ?",
            [cartId, productInfo[0].id]
        );

        if (cartProduct.length > 0 && cartProduct[0].quantity > 0) {
            if (cartProduct[0].quantity > 1) {
                let quantity = cartProduct[0].quantity - 1;

                await pool.execute(
                    "UPDATE cart_items SET quantity = ? WHERE cart_id = ? && product_id = ?",
                    [quantity, cartId, productInfo[0].id]
                );
                const [cartItems] = await pool.execute(
                    "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
                    [cartId]
                );

                const totalItems = cartItems.length;

                const { totalPrice, totalMRP, totalValidProducts } =
                    calculatePriceAndMRP(cartItems);

                res.status(200).json({
                    success: true,
                    message: `Updated ${productInfo[0].name}'s quantity to ${quantity}`,
                    cartItems,
                    totalItems,
                    totalPrice,
                    totalMRP,
                    totalValidProducts,
                });
            } else {
                await pool.execute("DELETE FROM cart_items WHERE cart_id = ? && product_id = ?", [
                    cartId,
                    productInfo[0].id,
                ]);
                const [cartItems] = await pool.execute(
                    "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
                    [cartId]
                );

                const totalItems = cartItems.length;

                const { totalPrice, totalMRP, totalValidProducts } =
                    calculatePriceAndMRP(cartItems);

                res.status(200).json({
                    success: true,
                    message: `Removed ${productInfo[0].name} from the cart`,
                    cartItems,
                    totalItems,
                    totalPrice,
                    totalMRP,
                    totalValidProducts,
                });
            }
        } else {
            return next(new errorHandler("Invalid product", 400));
        }
    } catch (err) {
        return next(new errorHandler(`Something went wrong`, 500));
    }
});

//get all products from the cart referenced to the user

exports.getCartItems = catchAsyncErrors(async (req, res, next) => {
    const { cartId } = req.user[0][0];

    const [cartItems] = await pool.execute("SELECT * FROM cart_items WHERE cart_id = ?", [cartId]);

    if (cartItems.length > 0) {
        const [allCartItems] = await pool.execute(
            "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
            [cartId]
        );

        const totalItems = allCartItems.length;

        const { totalPrice, totalMRP, totalValidProducts } = calculatePriceAndMRP(allCartItems);

        res.status(200).json({
            success: true,
            cart: allCartItems,
            totalItems,
            totalPrice,
            totalMRP,
            totalValidProducts,
        });
    } else {
        res.status(200).json({
            success: true,
            message: "No items in the cart",
        });
    }
});

//delete the item completely from the cart

exports.deleteItemFromCart = catchAsyncErrors(async (req, res, next) => {
    const { cartId } = req.user[0][0];
    const { product_id } = req.body;

    try {
        const [productInfo] = await pool.execute("SELECT * FROM products WHERE id = ?", [
            product_id,
        ]);
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_items WHERE cart_id = ? && product_id = ?",
            [cartId, productInfo[0].id]
        );

        if (cartProduct.length > 0 && cartProduct[0].quantity > 0) {
            await pool.execute("DELETE FROM cart_items WHERE cart_id = ? && product_id = ?", [
                cartId,
                product_id,
            ]);
            const [cartItems] = await pool.execute(
                "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
                [cartId]
            );

            const totalItems = cartItems.length;

            const { totalPrice, totalMRP, totalValidProducts } = calculatePriceAndMRP(cartItems);

            res.status(200).json({
                success: true,
                message: `Removed ${productInfo[0].name} from the cart.`,
                cartItems,
                totalItems,
                totalPrice,
                totalMRP,
                totalValidProducts,
            });
        } else {
            return next(new errorHandler("Invalid Product.", 400));
        }
    } catch (err) {
        return next(new errorHandler("Something went wrong", 500));
    }
});

//validate cart to remove invalid products (out of stock and deleted products)

exports.validateCart = catchAsyncErrors(async (req, res, next) => {
    const { cartId } = req.user[0][0];

    try {
        const [cartItems] = await pool.execute("SELECT * FROM cart_items WHERE cart_id = ?", [
            cartId,
        ]);

        if (cartItems.length > 0) {
            const [allCartItems] = await pool.execute(
                "SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted, c.created_at FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ? ORDER BY created_at DESC",
                [cartId]
            );

            let totalPrice = 0;
            let totalMRP = 0;
            let totalValidProducts = 0;
            let invalidProductIds = [];

            const validCartItems = allCartItems.filter((item) => {
                if (item.is_deleted === 0 && item.stock > 0) {
                    totalPrice = totalPrice + item.price * item.quantity;
                    totalMRP = totalMRP + item.mrp * item.quantity;
                    totalValidProducts++;
                    return true;
                } else {
                    invalidProductIds.push(item.id);
                    return false;
                }
            });

            if (invalidProductIds.length > 0) {
                const placeHolders = invalidProductIds.map(() => "?").join(",");
                const query = `DELETE FROM cart_items WHERE cart_id = ? AND product_id IN (${placeHolders})`;
                await pool.execute(query, [cartId, ...invalidProductIds]);
            }

            res.status(200).json({
                success: true,
                cart: validCartItems,
                totalItems: validCartItems.length,
                totalPrice,
                totalMRP,
                totalValidProducts,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "No items in the cart",
            });
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500));
    }
});

//clear cart items

exports.clearCart = catchAsyncErrors(async (req, res, next) => {
    const { cartId } = req.user[0][0];

    try {
        const [cartItems] = await pool.execute("SELECT * FROM cart_items WHERE cart_id = ?", [
            cartId,
        ]);

        if (cartItems.length > 0) {
            await pool.execute("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

            res.status(200).json({
                success: true,
            });
        } else {
            return next(new errorHandler("Cannot clear cart", 400));
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500));
    }
});

//delete the item completely from the cart and move to wishlist

// exports.moveToWishlist = catchAsyncErrors(async(req, res, next) => {
//     const { cartId } = req.user[0][0]
//     const { product_id, userId } = req.body

//     try{
//         const [isValidProduct] = await pool.execute("SELECT * FROM products WHERE id = ?", [product_id])

//         if(isValidProduct.length === 0){
//             return next(new errorHandler("Invalid product", 400))
//         }

//         const [cartProduct] = await pool.execute('SELECT * FROM cart_items WHERE cart_id = ? && product_id = ?', [cartId, product_id])
//         const [existingProduct] = await pool.execute("SELECT * FROM wishlist WHERE product_id = ? AND user_id = ?", [product_id, userId])

//         if(cartProduct.length > 0 && cartProduct[0].quantity > 0){

//             await pool.execute('DELETE FROM cart_items WHERE cart_id = ? && product_id = ?', [cartId, product_id])
//             const [cartItems] = await pool.execute('SELECT p.id, p.name, p.price, p.mrp, p.image_url, p.stock, c.quantity, p.is_deleted FROM products p, cart_items c WHERE c.product_id = p.id && c.cart_id = ?', [cartId])

//             const totalItems = cartItems.length
//             let totalPrice = 0;
//             let totalMRP = 0;
//             let totalValidProducts = 0

//             for(i=0; i<cartItems.length; i++){
//                 if(cartItems[i].is_deleted === 0 && cartItems[i].stock > 0){
//                     totalPrice = totalPrice + (cartItems[i].price * cartItems[i].quantity)
//                     totalMRP = totalMRP + (cartItems[i].mrp * cartItems[i].quantity)
//                     totalValidProducts++
//                 }
//             }

//             if(existingProduct.length === 0){
//                 const uuid = generate_uuid()

//                 await pool.execute("INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)", [uuid, userId, product_id])
//             }else{
//                 return next(new errorHandler("Product already in wishlist", 400))
//             }

//             res.status(201).json({
//                 success: true,
//                 message: `Product Moved to Wishlist.`,
//                 cartItems,
//                 totalItems,
//                 totalPrice,
//                 totalMRP,
//                 totalValidProducts
//             })
//         }else{
//             return next(new errorHandler("Invalid Product.", 400))
//         }
//     }catch(err){
//         return next(new errorHandler("Something went wrong", 500))
//     }
// })
