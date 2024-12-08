import { createSlice } from '@reduxjs/toolkit'
import {
    addToCart,
    clearCart,
    deleteItem,
    loadCart,
    removeFromCart,
    validateCart,
    updateCartStock
} from './cartThunks'

const initialState = {
    cart: [],
    totalPrice: 0,
    totalMRP: 0,
    totalItems: 0,
    totalValidProducts : 0,
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
            state.totalValidProducts = 0;
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
                    totalValidProducts : action.payload.totalValidProducts,
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
                    totalValidProducts : action.payload.totalValidProducts,
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
                    totalValidProducts : action.payload.totalValidProducts,
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
                    totalValidProducts : 0,
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
                    totalValidProducts : 0,
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
                    totalValidProducts : action.payload.totalValidProducts,
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

            //validate cart pending
            .addCase(validateCart.pending, (state) => {
                return{
                    ...state,
                    cartLoading: true,
                    cartMessage: null,
                    cartError: null
                }
            })

            //validate cart fulfilled
            .addCase(validateCart.fulfilled, (state, action) => {
                return{
                    ...state,
                    cartLoading: false,
                    cart: action.payload.cart || [],
                    totalItems: action.payload.totalItems,
                    totalPrice: action.payload.totalPrice,
                    totalMRP: action.payload.totalMRP,
                    totalValidProducts : action.payload.totalValidProducts,
                }
            })

            //validate cart rejected
            .addCase(validateCart.rejected, (state, action) => {
                return{
                    ...state,
                    cartLoading: false
                }
            })


            //update cart stock pending
            .addCase(updateCartStock.pending, (state) => {
                return{
                    ...state
                }
            })

            //update cart stock fulfilled
            .addCase(updateCartStock.fulfilled, (state, action) => {
                let updates = action.payload;

                // Proceed with your state update
                state.cart = state.cart.map(item => {
                    const update = updates.find(update => update.product_id === item.id);
                    if (update) {
                        return { ...item, stock: item.stock - update.product_quantity };
                    }
                    return item;
                });
            
                state.totalValidProducts = state.cart.reduce(
                    (count, item) => (item.stock > 0 ? count + 1 : count),
                    0
                );
            })
    }
})

export const { clearCartMessage, clearCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer