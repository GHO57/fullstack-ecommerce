import { createSlice } from '@reduxjs/toolkit'
import {
    addToCart,
    clearCart,
    deleteItem,
    loadCart,
    removeFromCart
} from './cartThunks'

const initialState = {
    cart: [],
    totalPrice: 0,
    totalMRP: 0,
    totalItems: 0,
    cartLoading: false,
    cartMessage: null,
    cartError: null
}


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartMessage: (state) => {
            state.cartMessage = null;
        },
        clearCartError: (state) => {
        state.cartError = null;
        },
        clearCartState: (state) => {
            state.cart= [];
            state.totalItems= 0;
            state.totalPrice= 0;
            state.totalMRP= 0;
        }
    },
    extraReducers: (builder) => {
        builder
            //add to cart pending
            .addCase(addToCart.pending, (state) => {
                return{
                    ...state,
                    cartLoading: true,
                    cartMessage: null,
                    cartError: null
                }
            })

            //add to cart fulfilled
            .addCase(addToCart.fulfilled, (state, action) => {
                return{
                    ...state,
                    cart: action.payload.cartItems || [],
                    totalItems: action.payload.totalItems,
                    totalPrice: action.payload.totalPrice,
                    totalMRP: action.payload.totalMRP,
                    cartLoading: false,
                    cartMessage: action.payload.message
                }
            })

            //add to cart rejected
            .addCase(addToCart.rejected, (state, action) => {
                return{
                    ...state,
                    cartLoading: false,
                    cartError: action.payload
                }
            })

            //remove from cart pending
            .addCase(removeFromCart.pending, (state) => {
                return{
                    ...state,
                    cartLoading: true,
                    cartMessage: null,
                    cartError: null
                }
            })

            //remove from cart fulfilled
            .addCase(removeFromCart.fulfilled, (state, action) => {
                return{
                    ...state,
                    cart: action.payload.cartItems || [],
                    totalItems: action.payload.totalItems,
                    totalPrice: action.payload.totalPrice,
                    totalMRP: action.payload.totalMRP,
                    cartLoading: false,
                    cartMessage: action.payload.message
                }
            })

            //remove from cart rejected
            .addCase(removeFromCart.rejected, (state, action) => {
                return{
                    ...state,
                    cartLoading: false,
                    cartError: action.payload
                }
            })

            //delete item pending
            .addCase(deleteItem.pending, (state) => {
                return{
                    ...state,
                    cartLoading: true,
                    cartMessage: null,
                    cartError: null
                }
            })

            //delete item fulfilled
            .addCase(deleteItem.fulfilled, (state, action) => {
                return{
                    ...state,
                    cart: action.payload.cartItems || [],
                    totalItems: action.payload.totalItems,
                    totalPrice: action.payload.totalPrice,
                    totalMRP: action.payload.totalMRP,
                    cartLoading: false,
                    cartMessage: action.payload.message
                }
            })

            //delete item rejected
            .addCase(deleteItem.rejected, (state, action) => {
                return{
                    ...state,
                    cartLoading: false,
                    cartError: action.payload
                }
            })


            //clear cart pending
            .addCase(clearCart.pending, (state) => {
                return{
                    ...state,
                    cartLoading: true,
                    cartMessage: null,
                    cartError: null
                }
            })

            //clear cart fulfilled
            .addCase(clearCart.fulfilled, (state, action) => {
                return{
                    ...state,
                    cart: [],
                    totalItems: 0,
                    totalPrice: 0,
                    totalMRP: 0,
                    cartLoading: false,
                }
            })

            //clear cart rejected
            .addCase(clearCart.rejected, (state, action) => {
                return{
                    ...state,
                    cart: [],
                    totalItems: 0,
                    totalPrice: 0,
                    totalMRP: 0,
                    cartLoading: false,
                }
            })

            //load cart pending
            .addCase(loadCart.pending, (state) => {
                return{
                    ...state,
                    cart: [],
                    cartLoading: true,
                    cartMessage: null,
                    cartError: null
                }
            })

            //load cart fulfilled
            .addCase(loadCart.fulfilled, (state, action) => {
                return{
                    ...state,
                    cart: action.payload.cart || [],
                    totalItems: action.payload.totalItems,
                    totalPrice: action.payload.totalPrice,
                    totalMRP: action.payload.totalMRP,
                    cartLoading: false,
                }
            })

            //load cart rejected
            .addCase(loadCart.rejected, (state, action) => {
                return{
                    ...state,
                    cart: [],
                    cartLoading: false,
                }
            })
    }
})

export const { clearCartMessage, clearCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer