import { createSlice } from "@reduxjs/toolkit";
import { 
    getAllProducts,
    getProductDetails
} from './productsThunks'

const initialState = {
    products: [],
    pagination: {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        perPage: 10
    },
    productDetailsLoading: false,
    productDetails: [],
    productLoading: false,
    productMessage: null,
    productError: null,
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductMessage: (state) => {
            state.productMessage = null;
        },
        clearProductError: (state) => {
        state.productError = null;
        },
    },
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
                    products: action.payload.allProducts || [],
                    pagination: action.payload.pagination || {
                        totalCount: 0,
                        totalPages: 0,
                        currentPage: 1,
                        perPage: 10,
                    },
                    productLoading: false,
                }
            })

            //get all products rejected
            .addCase(getAllProducts.rejected, (state, action) => {
                return{
                    ...state,
                    products: [],
                    productLoading: false,
                    productError: action.payload.message
                }
            })

            //get product details pending
            .addCase(getProductDetails.pending, (state) => {
                return{
                    ...state,
                    productDetailsLoading: true,
                    productMessage: null,
                    productError: null
                }
            })

            //get product details fulfilled
            .addCase(getProductDetails.fulfilled, (state, action) => {
                return{
                    ...state,
                    productDetails: action.payload.productDetails,
                    productDetailsLoading: false,
                }
            })

            //get product details rejected
            .addCase(getProductDetails.rejected, (state, action) => {
                return{
                    ...state,
                    productDetails: [],
                    productDetailsLoading: false,
                }
            })
    }
})

export const { clearProductMessage, clearProductError } = productSlice.actions;
export default productSlice.reducer