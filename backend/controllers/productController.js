const catchAsyncErrors = require("../middleware/catchAsynErrors")
const { pool } = require("../config/database")
const errorHandler = require("../utils/errorHandler")


//get all products

exports.getAllProducts = catchAsyncErrors(async(req, res, next) => {
    
    try{
        const { page, limit, sortBy, sortOrder, category, searchTerm } = req.query;  

        //pagination setup
        const pageNumber = parseInt(page, 10) || 1
        const limitNumber = parseInt(limit, 10) || 10
        const offset = (pageNumber - 1) * limitNumber


        //sorting setup
        const validSortFields = ['price', 'name', 'created_at']
        const order = ['asc', 'desc']
        const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at"
        const sortDirection = order.includes(sortOrder) ? sortOrder : "asc"

        //building the sql where clause for filtering
        let filterConditions = []
        let queryParams = []

        if(category && Array.isArray(category) && category.length > 0){
            const categoryPlaceholders = category.map(() => '?').join(', ')
            filterConditions.push(`category IN (${categoryPlaceholders})`)
            queryParams.push(...category)
        }

        if(searchTerm){
            filterConditions.push('name LIKE ?')
            queryParams.push(`%${searchTerm}%`)
        }

        //combine where clause with pagination, sorting and filtering
        const whereClause = filterConditions.length > 0 ? `WHERE is_deleted = 0 AND ${filterConditions.join(' AND ')}`: `WHERE is_deleted = 0`

        // Get filtered total count
        const [filteredTotal] = await pool.execute(
            `SELECT COUNT(*) AS count FROM products ${whereClause}`,
            [...queryParams]
        );
        const filteredCount = filteredTotal[0].count;

        //sql query to fetch products with pagination, sorting and filtering
        const [allProducts] = await pool.execute(
            `SELECT * FROM products ${whereClause} ORDER BY ${sortField} ${sortDirection} LIMIT ? OFFSET ?`,
            [...queryParams, String(limitNumber), String(offset)]
        );

        const totalPages = Math.ceil(filteredCount/limit)
        
        if(allProducts.length > 0) {
            res.status(200).json({
                success: true,
                allProducts,
                pagination: {
                    totalCount : filteredCount,
                    totalPages,
                    currentPage: Number(page),
                    perPage: Number(limit)
                }
            })
        }else{
            return next(new errorHandler("No products found", 404))
        }
    }catch(error){
        return next(new errorHandler(`Something went wrong`, 500))
    }
})

//get product details

exports.getProductDetails = catchAsyncErrors(async(req, res, next) => {
    const { product_id } = req.params

    if(!product_id){
        return next(new errorHandler("product id not provided", 400))
    }

    try{
        const [productDetails] = await pool.execute('SELECT * FROM products WHERE id = ?', [product_id])

        if(productDetails.length > 0){
            res.status(200).json({
                success: true,
                productDetails
            })
        }else{
            return next(new errorHandler("Product not found" ,404))
        }
    }catch(error){
        return next(new errorHandler(`Something went wrong ${error}`, 500))
    }
})