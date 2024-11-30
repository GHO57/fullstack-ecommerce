const { pool } = require("../config/database")
const instance =  require("../config/razorpay")
const catchAsyncErrors = require("../middleware/catchAsynErrors")
const errorHandler = require("../utils/errorHandler")
const crypto = require('crypto')
const { v4: uuidv4 } = require("uuid")


//generate random uuid

const generate_uuid = () => {
    return uuidv4()
}

//checkout

exports.checkout = catchAsyncErrors(async(req, res, next) => {
    const { amount, paymentMethod, address_id } = req.body
    const { userId } = req.user[0][0]

    if(!amount || !paymentMethod || !address_id){
        return next(new errorHandler('Payment Cannot be proceeded. try again', 400))
    }
    
    try{
        const options = {
            amount: Number(amount * 100),
            currency: "INR"
        }
    
        const order = await instance.orders.create(options)

        const [redundantOrders] = await pool.execute('SELECT * FROM orders WHERE user_id = ? AND status = "Pending" AND (payment_id IS NULL AND payment_status IS NULL)', [userId])
        
        if(redundantOrders.length > 0){
            await pool.execute('DELETE FROM orders WHERE payment_id IS NULL AND payment_status IS NULL')
            await pool.execute('INSERT INTO orders (id, user_id, delivery_address_id, total, status, payment_method) VALUES (?, ?, ?, ?, ?, ?)', [order.id, userId, address_id, amount, 'Pending', paymentMethod])
        }else{
            await pool.execute('INSERT INTO orders (id, user_id, delivery_address_id, total, status, payment_method) VALUES (?, ?, ?, ?, ?, ?)', [order.id, userId, address_id, amount, 'Pending', paymentMethod])
        }
        
        res.status(200).json({
            success: true,
            order,
        })
    }catch(error){
        return next(new errorHandler(`Something went wrong`, 500))
    }
})


//verify the payment

exports.paymentVerification = catchAsyncErrors(async(req, res, next) => {
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { cartId } = req.user[0][0];

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        let connection;

        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            const [order] = await connection.execute('SELECT * FROM orders WHERE id = ?', [razorpay_order_id]);

            if (order.length > 0) {
                await connection.execute('UPDATE orders SET payment_id = ?, payment_status = "Completed" WHERE id = ?', [razorpay_payment_id, razorpay_order_id]);

                const [cartItems] = await connection.execute('SELECT ci.product_id, p.seller_id, ci.quantity, p.price, p.mrp FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?', [cartId]);

                for (let i = 0; i < cartItems.length; i++) {
                    const uuid = generate_uuid()
                    await connection.execute('INSERT INTO order_items (id, order_id, product_id, seller_id, quantity, price, mrp, product_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [uuid, razorpay_order_id, cartItems[i].product_id, cartItems[i].seller_id, cartItems[i].quantity, cartItems[i].price, cartItems[i].mrp, "Pending"]);
                }

                for(let j = 0; j < cartItems.length; j++){
                    const quantity = cartItems[j].quantity
                    await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, cartItems[j].product_id])
                }

                await connection.commit();
                connection.release();
                res.status(200).json({
                    success: true
                })
            } else {
                await connection.rollback();
                connection.release();

                return next(new errorHandler('Order not found or already processed', 404));
            }

        } catch (error) {
            if (connection) {
                await connection.rollback();
                connection.release();
            }

            return next(new errorHandler(`Something went wrong`, 500));
        }

    } else {
        return next(new errorHandler('Payment verification failed', 400));
    }
})



//get razorpay key_id

exports.getkey = catchAsyncErrors(async(req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY,
    })
})