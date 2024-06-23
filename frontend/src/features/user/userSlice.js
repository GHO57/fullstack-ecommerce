import { createSlice } from "@reduxjs/toolkit";
import {
    sendotp,
    loginsignup,
    signupuser,
    logoutuser,
    loaduser,
    addDeliveryAddress,
    deleteDeliveryAddress,
    getAllOrders,
    getOrderItems
} from './userThunks'

const initialState = {
    user: {},
    deliveryAddress: [],
    allOrders: [],
    orderItems: [],
    loading: false,
    loadingLogin: false,
    isAuthenticated: false,
    isLoggingIn: false,
    newUser: false,
    OTPSent: false,
    message: null,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            //sendotp pending
            .addCase(sendotp.pending, (state) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: true,
                    isAuthenticated: false,
                    isLoggingIn: false,
                    newUser: false,
                    OTPSent: false,
                    message: null,
                    error: null
                }
            })

            //sendotp fulfilled
            .addCase(sendotp.fulfilled, (state, action) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: false,
                    newUser: false, 
                    OTPSent: true,
                    message: action.payload,
                    error: null
                }
            })

            //sendotp rejected
            .addCase(sendotp.rejected, (state, action) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: false,
                    newUser: false,
                    OTPSent: false,
                    error: action.payload
                }
            })

            //loginsignup pending
            .addCase(loginsignup.pending, (state) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: true,
                    isAuthenticated: false,
                    isLoggingIn: false,
                    newUser: false,
                    OTPSent: false,
                    message: null,
                    error: null
                }
            })

            //loginsignup fulfilled
            .addCase(loginsignup.fulfilled, (state, action) => {
                if(action.payload.newUser){
                    return{
                        ...state,
                        loading: false,
                        loadingLogin: false,
                        isAuthenticated: false,
                        newUser: true,
                        OTPSent: false,
                        user: action.payload.newUser,
                        error: null
                    }
                }else{
                    return{
                        ...state,
                        loading: false,
                        loadingLogin: false,
                        isAuthenticated: true,
                        isLoggingIn: true,
                        newUser: false,
                        user: action.payload.user,
                        OTPSent: false,
                        message: `Welcome ${action.payload.user[0].fullname}`,
                        error: null
                    }
                }
            })

            //loginsignup rejected
            .addCase(loginsignup.rejected, (state, action) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: false,
                    OTPSent: false,
                    error: action.payload
                }
            })

            //signupuser pending
            .addCase(signupuser.pending, (state) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: true,
                    isAuthenticated: false,
                    isLoggingIn: false,
                    newUser: true,
                    OTPSent: false,
                    message: null,
                    error: null
                }
            })

            //signupuser fulfilled
            .addCase(signupuser.fulfilled, (state, action) => {
                    return{
                        ...state,
                        loading: false,
                        loadingLogin: false,
                        isAuthenticated: true,
                        isLoggingIn: true,
                        newUser: false,
                        user: action.payload.user,
                        OTPSent: false,
                        message: `Welcome ${action.payload.user[0].fullname}`,
                        error: null
                }
            })

            //signupuser rejected
            .addCase(signupuser.rejected, (state, action) => {
                return{
                    ...state,
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: false,
                    newUser: false,
                    OTPSent: false,
                    user: null,
                    error: action.payload
                }
            })

            //add Delivery Address pending
            .addCase(addDeliveryAddress.pending, (state) => {
                return{
                    ...state, 
                    loading: true,
                    message: null,
                    error: null
                }
            })

            //add Delivery Address fulfilled
            .addCase(addDeliveryAddress.fulfilled, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    deliveryAddress: action.payload.deliveryAddress || [],
                    message: action.payload.message
                }
            })
            
            //add delivery address rejected
            .addCase(addDeliveryAddress.rejected, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    deliveryAddress: [],
                    error: action.payload
                }
            })

            //delete Delivery Address pending
            .addCase(deleteDeliveryAddress.pending, (state) => {
                return{
                    ...state, 
                    loading: true,
                    message: null,
                    error: null
                }
            })

            //delete Delivery Address fulfilled
            .addCase(deleteDeliveryAddress.fulfilled, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    deliveryAddress: action.payload.deliveryAddress || [],
                    message: action.payload.message
                }
            })
            
            //delete delivery address rejected
            .addCase(deleteDeliveryAddress.rejected, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    deliveryAddress: [],
                    error: action.payload
                }
            })

            //get all orders pending
            .addCase(getAllOrders.pending, (state) => {
                return{
                    ...state, 
                    loading: true,
                    allOrders: [],
                    orderItems: [],
                    message: null,
                    error: null
                }
            })

            //get all orders fulfilled
            .addCase(getAllOrders.fulfilled, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    allOrders: action.payload.orders || [],
                    message: action.payload.message
                }
            })
            
            //get all orders rejected
            .addCase(getAllOrders.rejected, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    allOrders: [],
                    error: action.payload
                }
            })

            //get order items pending
            .addCase(getOrderItems.pending, (state) => {
                return{
                    ...state, 
                    loading: true,
                    orderItems: [],
                    message: null,
                    error: null
                }
            })

            //get order items fulfilled
            .addCase(getOrderItems.fulfilled, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    orderItems: action.payload.orderItems || [],
                    message: action.payload.message
                }
            })
            
            //get order items rejected
            .addCase(getOrderItems.rejected, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    orderItems: [],
                    error: action.payload
                }
            })

            //loaduser pending
            .addCase(loaduser.pending, (state) => {
                return{
                    ...state, 
                    loading: true,
                    loadingLogin:false, 
                    isAuthenticated: false,
                    isLoggingIn: false,
                    newUser: false,
                    user: null,
                    OTPSent: false,
                    message: null,
                    error: null
                }
            })

            //loaduser fulfilled
            .addCase(loaduser.fulfilled, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: true,
                    isLoggingIn: false,
                    newUser: false,
                    user: action.payload.user,
                    deliveryAddress: action.payload.deliveryAddress || [],
                    OTPSent: false,
                    error: null
                }
            })
            
            //loaduser rejected
            .addCase(loaduser.rejected, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: false,
                    newUser: false,
                    user: null,
                    deliveryAddress: [],
                    OTPSent: false,
                    error: action.payload
                }
            })

            //logoutuser pending
            .addCase(logoutuser.pending, (state) => {
                return{
                    ...state, 
                    loading: true,
                    loadingLogin:false, 
                    isAuthenticated: true,
                    newUser: false,
                    OTPSent: false,
                    message: null,
                    error: null
                }
            })

            //logoutuser fulfilled
            .addCase(logoutuser.fulfilled, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: false,
                    newUser: false,
                    user: null,
                    message: action.payload.message,
                    OTPSent: false,
                    error: null
                }
            })
            
            //logoutuser rejected
            .addCase(logoutuser.rejected, (state, action) => {
                return{
                    ...state, 
                    loading: false,
                    loadingLogin: false,
                    isAuthenticated: true,
                    newUser: false,
                    OTPSent: false,
                    error: action.payload
                }
            })
    } 
})

export default userSlice.reducer
