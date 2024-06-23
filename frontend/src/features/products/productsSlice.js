import { createSlice } from "@reduxjs/toolkit";
import { 
    getAllProducts,
    getProductDetails
} from './productsThunks'

const initialState = {
    products: [],
    productDetails: [],
    productLoading: false,
    productMessage: null,
    productError: null,
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //get all products pending
            .addCase(getAllProducts.pending, (state) => {
                return{
                    ...state,
                    productLoading: true,
                    productMessage: null,
                    productError: null,
                }
            })

            //get all products fulfilled
            .addCase(getAllProducts.fulfilled, (state, action) => {
                return{
                    ...state,
                    products: action.payload.allProducts,
                    productLoading: false,
                }
            })

            //get all products rejected
            .addCase(getAllProducts.rejected, (state, action) => {
                return{
                    ...state,
                    products: [],
                    productLoading: false
                }
            })

            //get product details pending
            .addCase(getProductDetails.pending, (state) => {
                return{
                    ...state,
                    productLoading: true,
                    productMessage: null,
                    productError: null
                }
            })

            //get product details fulfilled
            .addCase(getProductDetails.fulfilled, (state, action) => {
                return{
                    ...state,
                    productDetails: action.payload.productDetails,
                    productLoading: false,
                }
            })

            //get product details rejected
            .addCase(getProductDetails.rejected, (state, action) => {
                return{
                    ...state,
                    productDetails: [],
                    productLoading: false,
                }
            })
    }
})

export default productSlice.reducer