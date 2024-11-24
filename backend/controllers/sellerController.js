const { pool } = require("../config/database");
const catchAsyncErrors = require("../middleware/catchAsynErrors");
const errorHandler = require("../utils/errorHandler");
const { v4: uuidv4 } = require("uuid");
const { sendSellerToken } = require("../utils/jwtToken");
const cloudinary = require("../config/cloudinary");

//generate uuid

const generate_uuid = () => {
  return uuidv4();
};

//seller application

exports.sellerApplication = catchAsyncErrors(async (req, res, next) => {
  const { fullname, email, companyname, companyaddress, gstin } = req.body;

  const [existingSeller] = await pool.execute(
    "SELECT * FROM sellers WHERE gstin = ? || email = ?",
    [gstin, email]
  );
  const [appliedSeller] = await pool.execute(
    "SELECT * FROM seller_applications WHERE gstin = ? || email = ?",
    [gstin, email]
  );

  try {
    if (existingSeller.length > 0) {
      return next(new errorHandler("Already a seller", 400));
    } else {
      if (appliedSeller.length > 0) {
        return next(new errorHandler("Already applied."));
      } else {
        const uuid = generate_uuid();
        await pool.execute(
          "INSERT INTO seller_applications (id, full_name, email, company_name, company_address, gstin) VALUES (?, ?, ?, ?, ?, ?)",
          [uuid, fullname, email, companyname, companyaddress, gstin]
        );
        res.status(201).json({
          success: true,
          message: "Application submitted successfully",
        });
      }
    }
  } catch (error) {
    return next(new errorHandler("something went wrong", 500));
  }
});

//seller login

exports.sellerLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Enter all the required fields.", 400));
  }

  const [seller] = await pool.execute("SELECT * FROM sellers WHERE email = ?", [
    email,
  ]);
  const [pass] = await pool.execute(
    "SELECT password FROM sellers WHERE email = ?",
    [email]
  );

  if (seller.length > 0 && pass[0].password === password) {
    const seller_id = seller[0].id
    const [sellerProducts] = await pool.execute(
      "SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0",
      [seller_id]
    )
    const [deletedProducts] = await pool.execute(
      "SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1",
      [seller_id]
    )
    sendSellerToken(seller, sellerProducts, deletedProducts, 201, res);
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid email or password.",
    });
  }
});

//logout

exports.sellerLogout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("SELLERAUTHCOOKIE", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Seller Logged Out.",
  });
});

//get seller details (dashboard)

exports.getSellerDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user[0][0];

  try {
    const [sellerUser] = await pool.execute(
      "SELECT * FROM sellers WHERE id = ?",
      [id]
    );
    const [sellerProducts] = await pool.execute(
      "SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0",
      [id]
    )
    const [deletedProducts] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1', [id])


    if (sellerUser.length > 0) {
      res.status(200).json({
        success: true,
        sellerUser,
        sellerProducts,
        deletedProducts
      });
    } else {
      return next(new errorHandler("Seller not found", 404));
    }
  } catch (error) {
    return next(new errorHandler("Something went wrong", 500));
  }
});

//add product

exports.addProduct = catchAsyncErrors(async (req, res, next) => {
  let { name, description, category, price, mrp, stock } = req.body;
  const { id } = req.user[0][0];

  price = parseInt(price)
  mrp = parseInt(mrp)
  stock = parseInt(stock)

  if (!name || !description || !category || !price || !mrp || !stock) {
    return next(new errorHandler("Enter all the required fields", 400));
  }

  if(price > mrp){
    return next(new errorHandler("Price should not be greater than MRP", 400))
  }

  try {
    const [existingProduct] = await pool.execute(
      "SELECT * FROM products WHERE name = ? && seller_id = ?",
      [name, id]
    );

    if (existingProduct.length > 0) {
      return next(
        new errorHandler("You already have a product with this name", 400)
      );
    } else {
      if (!req.file) {
        return next(new errorHandler("No image file provided", 400));
      }

      const publicId = generate_uuid();

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `/products/${id}`,
            public_id: publicId,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });

      const image_url = result.secure_url;

      await pool.execute(
        "INSERT INTO products (id, seller_id, name, description, category, price, mrp, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [publicId, id, name, description, category, price, mrp, stock, image_url]
      );

      const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [id])


      res.status(201).json({
        success: true,
        message: "product added successfully",
        data: {
          publicId,
          name,
          description,
          category,
          price,
          mrp,
          stock,
          image_url,
        },
        products
      });
    }
  } catch (error) {
    return next(new errorHandler(`Something went wrong ${error.message}`, 500));
  }
});

//delete product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { public_id } = req.params;
  const { id } = req.user[0][0];

  if(!public_id){
    return next(new errorHandler('public_id not provided', 400))
  }

  try {
    const [existingProduct] = await pool.execute(
      "SELECT * FROM products WHERE id = ? && is_deleted = 0",
      [public_id]
    );

    if (existingProduct.length > 0) {
      // cloudinary.uploader.destroy(
      //   `products/${id}/${public_id}`,
      //   (error, result) => {
      //     if (error) {
      //       return next(new errorHandler("Error deleting the product", 500));
      //     }

      //     pool
      //       .execute("DELETE FROM products WHERE id = ?", [public_id])
      //       .then(() => {
      //         res.status(200).json({
      //           success: true,
      //           message: "product deleted successfully",
      //         });
      //       })
      //       .catch((error) => {
      //         return next(new errorHandler("Error deleting the product", 400));
      //       });
      //   }
      // );

      await pool.execute('UPDATE products SET is_deleted = 1 WHERE id = ? && seller_id = ?', [public_id, id])
      
      const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [id])
      const [deletedProducts] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1', [id])
      
      res.status(200).json({
        success: true,
        message: "product deleted successfully",
        products,
        deletedProducts
      })
    } else {
      return next(new errorHandler("product doesn't exist", 404));
    }
  } catch (error) {
    return next(new errorHandler(`Something went wrong`, 500));
  }
});


//delete multiple products

exports.deleteMultipleProducts = catchAsyncErrors(async (req, res, next) => {
  let { productIds } = req.query;
  const { id } = req.user[0][0];
  
  let isProductExist = 0;
  
  if(typeof productIds === 'undefined'){
    productIds = req.body.productIds
  }
  
  if(!productIds || !productIds.length){
    return next(new errorHandler('no products selected', 400))
  }

  try {
    for(i=0; i < productIds.length; i++){
      const [existingProduct] = await pool.execute(
        "SELECT * FROM products WHERE id = ? AND is_deleted = 0",
        [productIds[i]]
      );

      if(existingProduct.length > 0){
        isProductExist += 1;
      }
    }
      
      if (isProductExist ===  productIds.length) {
        for(i=0; i < productIds.length; i++){
          await pool.execute('UPDATE products SET is_deleted = 1 WHERE id = ? && seller_id = ?', [productIds[i], id])
        }
        
        const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [id])
        const [deletedProducts] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1', [id])
        
        res.status(200).json({
          success: true,
          message: "products deleted successfully",
          products,
          deletedProducts
        })
      
      } else {
        return next(new errorHandler("Some products are not found, so nothing deleted", 404));
      }
  } catch (error) {
    return next(new errorHandler(`Something went wrong`, 500));
  }
});


//restore product 

exports.restoreProduct = catchAsyncErrors(async(req, res, next) => {
  const { product_id } = req.params
  const { id } = req.user[0][0]

  if(!product_id){
    return next(new errorHandler('id not provided', 400))
  }

  try{
    const [existingProduct] = await pool.execute('SELECT * FROM products WHERE id = ? AND seller_id = ? AND is_deleted = 1', [product_id, id])

    if(existingProduct.length > 0){
      await pool.execute('UPDATE products SET is_deleted = 0 WHERE id = ? AND seller_id = ?', [product_id, id])

      const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [id])
      const [deletedProducts] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1', [id])
      
      res.status(200).json({
        success: true,
        message: "product restored successfully",
        products,
        deletedProducts
      })
    }else{
      return next(new errorHandler('product not available', 404))
    }
  }catch(error){
    return next(new errorHandler('something went wrong', 500))
  }

})


//restore multiple products 

exports.restoreMultipleProducts = catchAsyncErrors(async (req, res, next) => {
  let { productIds } = req.query;
  const { id } = req.user[0][0];
  
  let isProductExist = 0;
  
  if(typeof productIds === 'undefined'){
    productIds = req.body.productIds
  }
  
  if(!productIds || !productIds.length){
    return next(new errorHandler('no products selected', 400))
  }

  try {
    for(i=0; i < productIds.length; i++){
      const [existingProduct] = await pool.execute(
        "SELECT * FROM products WHERE id = ? AND is_deleted = 1",
        [productIds[i]]
      );

      if(existingProduct.length > 0){
        isProductExist += 1;
      }
    }
      
      if (isProductExist ===  productIds.length) {
        for(i=0; i < productIds.length; i++){
          await pool.execute('UPDATE products SET is_deleted = 0 WHERE id = ? && seller_id = ?', [productIds[i], id])
        }
        
        const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [id])
        const [deletedProducts] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1', [id])
        
        res.status(200).json({
          success: true,
          message: "products restored successfully",
          products,
          deletedProducts
        })
      
      } else {
        return next(new errorHandler("Some products are not found, so nothing restored", 404));
      }
  } catch (error) {
    return next(new errorHandler(`Something went wrong`, 500));
  }
});

//update product details

exports.updateProductDetails = catchAsyncErrors(async (req, res, next) => {
  let { id, name, description, category, price, mrp, stock } = req.body;

  price = Number(price)
  mrp = Number(mrp)

  if (!id || !name || !description || !category || !price || !mrp || !stock) {
    return next(new errorHandler("No fields should be left empty", 400));
  }

  if(price > mrp){
    return next(new errorHandler("Price should not be greater than MRP", 400))
  }

  try {
    const [existingProduct] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (existingProduct.length === 0) {
      return next(new errorHandler("No product exist"));
    } else {
      const seller_id = existingProduct[0].seller_id;
      const [sameNameProduct] = await pool.execute(
        "SELECT * FROM products WHERE name = ? AND id <> ? AND seller_id = ?",
        [name, id, seller_id]
      );

      if (sameNameProduct.length > 0) {
        return next(
          new errorHandler("You already have a product with this name", 400)
        );
      } else {
        if (!req.file) {
          await pool.execute(
            "UPDATE products SET name = ?, description = ?, category = ?, price = ?, mrp = ?, stock = ? WHERE id = ? && seller_id = ?",
            [name, description, category, price, mrp, stock, id, seller_id]
          );

          const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [seller_id])
          const [product] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND id = ? AND is_deleted = 0', [seller_id, id])

          res.status(200).json({
            success: true,
            message: "Product updated successfully",
            products,
            product
          });
        } else {
          const publicId = id;

          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: `/products/${seller_id}`,
                public_id: publicId,
                overwrite: true,
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            stream.end(req.file.buffer);
          });

          const image_url = result.secure_url;

          await pool.execute(
            "UPDATE products SET name = ?, description = ?, category = ?, price = ?, mrp = ?, stock = ?, image_url = ? WHERE id = ? AND seller_id = ?",
            [name, description, category, price, mrp, stock, image_url, id, seller_id]
          );

          const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [seller_id])
          const [product] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND id = ? AND is_deleted = 0', [seller_id, id])


          res.status(201).json({
            success: true,
            message: "product updated successfully",
            products,
            product
          });
        }
      }
    }
  } catch (error) {
    return next(new errorHandler(`Something went wrong`, 500));
  }
});



//get all products

exports.getProducts = catchAsyncErrors(async(req, res, next) => {
    const { id } = req.user[0][0]
    
    try{
        const [products] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 0', [id])
        const [deletedProducts] = await pool.execute('SELECT * FROM products WHERE seller_id = ? AND is_deleted = 1', [id])

        if(products.length > 0){    
            res.status(200).json({
                success: true,
                products,
                deletedProducts
            })
        }else{
            return next(new errorHandler('No products', 404))
        }

    }catch(error){
        return next(new errorHandler('Something went wrong', 500))
    }
})


//get product details

exports.getProductDetails = catchAsyncErrors(async(req, res, next) => {
    const { product_id } = req.params
    const { id } = req.user[0][0]

    if(!product_id){
        return next(new errorHandler('Enter product id', 400))
    }

    try{
        const [product] = await pool.execute('SELECT * FROM products WHERE id = ? AND seller_id = ? AND is_deleted = 0', [product_id, id])

        if(product.length > 0){
            res.status(200).json({
                success: true,
                product
            })
        }else{
            return next(new errorHandler('No product found', 404))
        }
    }catch(error){
        return next(new errorHandler('Something went wrong', 500))
    }
})



//get all orders by seller id

exports.getAllOrdersBySellerId = catchAsyncErrors(async(req, res, next) => {
  const { id } = req.user[0][0]

  const sellerId = id

  if(!sellerId){
      return next(new errorHandler("You're not logged in", 400))
  }

  try{
      const [orderIds] = await pool.execute('SELECT DISTINCT order_id FROM order_items WHERE seller_id = ?', [sellerId])

      const orderIdsArray = orderIds.map(row => row.order_id);
      const placeholders = orderIdsArray.map(() => '?').join(',');
      const query = `
      SELECT 
        o.id, 
        o.user_id, 
        o.delivery_address_id, 
        o.total, 
        o.status, 
        o.payment_id, 
        o.payment_status, 
        o.payment_method, 
        o.created_at,
        SUM(oi.quantity * oi.price) AS total_price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id IN (${placeholders})
      AND oi.seller_id = ?
      AND o.payment_status IS NOT NULL 
      AND o.payment_id IS NOT NULL
      GROUP BY o.id, o.user_id, o.delivery_address_id, o.total, o.status, o.payment_id, o.payment_status, o.payment_method, o.created_at
    `;
      const [orders] = await pool.execute(query, [...orderIdsArray, sellerId])


      if(orders.length > 0){
          res.status(200).json({
              success: true,
              orders
          })
      }else{
          return next(new errorHandler("No Orders Found", 404))
      }
  }catch(error){
      return next(new errorHandler(`Something went wrong ${error}`, 500))
  }
})

//get order items by order id

exports.getOrderItemsBySellerId = catchAsyncErrors(async(req, res, next) => {
  const { order_id } = req.params
  const { id } = req.user[0][0]

  const sellerId = id

  if(!order_id){
      return next(new errorHandler("Order id not provided", 400))
  }

  try{
      const [orderItems] = await pool.execute('SELECT oi.id, oi.order_id, oi.product_id, oi.seller_id, oi.quantity, oi.price, oi.mrp, oi.product_status, p.image_url, p.name FROM order_items oi, products p WHERE oi.product_id = p.id AND order_id = ? AND oi.seller_id = ?', [order_id, sellerId])

      if(orderItems.length > 0){
          res.status(200).json({
              success: true,
              orderItems
          })
      }else{
          return next(new errorHandler('Order Not Found', 404))
      }
  }catch(error){
      return next(new errorHandler(`Something went wrong`, 500))
  }
})

//change order status

exports.updateOrderItemStatus = catchAsyncErrors(async(req, res, next) => {
  const { order_id, item_id, status } = req.body

  if(!item_id){
      return next(new errorHandler("item id not provided", 400))
  }

  const [previousStatus] = await pool.execute('SELECT product_status from order_items WHERE id = ?', [item_id])

  try{
      if(previousStatus[0].product_status === status){
          return next(new errorHandler(`already in '${status}' status`, 400))
      }else if(status === "Delivered"){
          const [deliveredProductsCount] = await pool.execute('SELECT COUNT(order_id) AS order_id_count FROM order_items WHERE order_id = ? AND product_status = "Delivered"', [order_id])
          const [orderItemsCount] = await pool.execute('SELECT COUNT(order_id) AS order_id_count FROM order_items WHERE order_id = ?', [order_id])


          if(deliveredProductsCount[0].order_id_count === (orderItemsCount[0].order_id_count - 1)){
            await pool.execute('UPDATE order_items SET product_status = ? WHERE id = ?', [status, item_id])
            await pool.execute('UPDATE orders SET status = "Delivered" WHERE id = ?', [order_id])

            res.status(200).json({
                success: true,
                message: `Status updated to '${status}'`,
                item_id, 
                status
            })
            
          }

          await pool.execute('UPDATE order_items SET product_status = ? WHERE id = ?', [status, item_id])
          res.status(200).json({
            success: true,
            message: `Status updated to '${status}'`,
            item_id, 
            status
        })
      }else{
          await pool.execute('UPDATE order_items SET product_status = ? WHERE id = ?', [status, item_id])
          res.status(200).json({
              success: true,
              message: `Status updated to '${status}'`,
              item_id, 
              status
          })
      }
  }catch(err){
      return next(new errorHandler(`No item found with this id`, 404))
  }
})

// Get seller orders
exports.getSellerOrders = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.user[0][0];

  try {
      const [orderItems] = await pool.execute(
        `SELECT 
        oi.id AS order_item_id,
        oi.order_id,
        oi.product_id,
        oi.seller_id,
        oi.quantity,
        oi.price AS order_item_price,
        oi.mrp AS order_item_mrp,
        oi.product_status,
        o.id AS order_id,
        o.user_id,
        o.delivery_address_id,
        o.total AS order_total,
        o.status AS order_status,
        o.payment_id,
        o.payment_status,
        o.payment_method,
        o.created_at AS order_created_at,
        p.id AS product_id,
        p.seller_id AS product_seller_id,
        p.name AS product_name,
        p.description AS product_description,
        p.category AS product_category,
        p.price AS product_price,
        p.mrp AS product_mrp,
        p.stock AS product_stock,
        p.image_url AS product_image_url,
        p.created_at AS product_created_at,
        p.updated_at AS product_updated_at,
        p.is_deleted AS product_is_deleted
    FROM 
        order_items oi 
    JOIN 
        orders o ON oi.order_id = o.id 
    JOIN 
        products p ON oi.product_id = p.id 
    WHERE 
        p.seller_id = ?;`,  
          [id]
      );

      let totalSales = 0;
      let totalOrders = new Set();
      let totalProductsSold = 0;

      orderItems.forEach(item => {
          totalSales += item.order_item_price * item.quantity;
          totalOrders.add(item.order_id);
          totalProductsSold += item.quantity;
      });

    res.status(200).json({
        success: true,
        orders: orderItems,
        stats: {
            totalSales,
            totalOrders: totalOrders.size,
            totalProductsSold
        }
    });
  } catch (error) {
      return next(new errorHandler(`Something went wrong ${id}`, 500));
  }
});