import { createSlice } from "@reduxjs/toolkit"
import {
    addToWishlist,
    removeFromWishlist,
    loadWishlist
} from "./wishlistThunks"

const initialState = {
    wishlist: [],
    numberOfProducts: 0,
    wishlistLoading: false,
    wishlistMessage: null,
    wishlistError: null
}
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlistMessage: (state) => {
            state.wishlistMessage = null
        },
        clearWishlistError: (state) => {
            state.wishlistError = null
        }
    },
    extraReducers : (builder) => {
        builder
            //add to wishlist pending
            .addCase(addToWishlist.pending, (state) => {
                return{
                    ...state,
                    wishlistLoading: true,
                    wishlistMessage : null,
                    wishlistError: null
                }
            })
            //add to wishlist fulfilled
            .addCase(addToWishlist.fulfilled, (state, action) => {
                return{
                    ...state,
                    wishlistLoading: false,
                    wishlist: action.payload.wishlistProducts,
                    numberOfProducts: action.payload.numberOfProducts,
                    wishlistMessage: action.payload.message
                }
            })
            //add to wishlist rejected
            .addCase(addToWishlist.rejected, (state, action) =>{
                return{
                    ...state,
                    wishlistLoading: false,
                    wishlistError: action.payload.message
                }
            })


            //remove from  wishlist pending
            .addCase(removeFromWishlist.pending, (state) => {
                return{
                    ...state,
                    wishlistLoading: true,
                    wishlistMessage : null,
                    wishlistError: null
                }
            })
            //remove from wishlist fulfilled
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                return{
                    ...state,
                    wishlistLoading: false,
                    wishlist: action.payload.wishlistProducts,
                    numberOfProducts: action.payload.numberOfProducts,
                    wishlistMessage: action.payload.message
                }
            })
            //remove from wishlist rejected
            .addCase(removeFromWishlist.rejected, (state, action) =>{
                return{
                    ...state,
                    wishlistLoading: false,
                    wishlistError: action.payload.message
                }
            })


            //load wishlist pending
            .addCase(loadWishlist.pending, (state) => {
                return{
                    ...state,
                    wishlistLoading: true,
                    wishlistMessage : null,
                    wishlistError: null
                }
            })
            //load wishlist wishlist fulfilled
            .addCase(loadWishlist.fulfilled, (state, action) => {
                return{
                    ...state,
                    wishlistLoading: false,
                    wishlist: action.payload.wishlistProducts,
                    numberOfProducts: action.payload.numberOfProducts,
                }
            })
            //load wishlist wishlist rejected
            .addCase(loadWishlist.rejected, (state, action) =>{
                return{
                    ...state,
                    wishlist: [],
                    wishlistLoading: false,
                }
            })

    }
})


export const { clearWishlistError, clearWishlistMessage } = wishlistSlice.actions
export default wishlistSlice.reducer