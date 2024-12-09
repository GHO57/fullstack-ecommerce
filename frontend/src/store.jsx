import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";
import sellerReducer from "./features/seller/sellerSlice";
import productsReducer from "./features/products/productsSlice";
import cartReducer from "./features/cart/cartSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";

//combine reducers

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    admin: adminReducer,
    seller: sellerReducer,
    products: productsReducer,
    wishlist: wishlistReducer,
});

//configure store

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: import.meta.env.VITE_ENV !== "production",
});
