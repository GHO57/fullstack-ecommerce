import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import axiosInstance from "../axiosInstance";

//send otp through email 

export const sendotp = createAsyncThunk('user/sentotp', async(email, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axiosInstance.post('/api/v1/user/sendotp', { email }, config)

        return data.message
    }catch(error){
        if (error.response) {
            return thunkAPI.rejectWithValue(error.response.data);
        } else {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
})


//login/signup 

export const loginsignup = createAsyncThunk("user/loginsignup", async(form, thunkAPI) => {
    try{
        const config = { headers : { "Content-Type" : "application/json" }};
        const { data } = await axiosInstance.post('/api/v1/user/loginsignup', form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//signup new user
export const signupuser = createAsyncThunk("user/signupuser", async(form, thunkAPI) => {
    try{
        const config = { headers : { "Content-Type" : "application/json" }};
        const { data } = await axiosInstance.post('/api/v1/user/signupuser', form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//logout
export const logoutuser = createAsyncThunk("user/logout", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.post('/api/v1/user/logout')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//add delivery address
export const addDeliveryAddress = createAsyncThunk("user/add-delivery-address", async(form, thunkAPI) => {
    try{
        const config = { headers : { "Content-Type" : "application/json" }};
        const { data } = await axiosInstance.post('/api/v1/user/adddeliveryaddress', form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//delete delivery address
export const deleteDeliveryAddress = createAsyncThunk("user/delete-delivery-address", async(address_id, thunkAPI) => {
    try{
        const config = { headers : { "Content-Type" : "application/json" }};
        const { data } = await axiosInstance.post('/api/v1/user/deletedeliveryaddress', { address_id }, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//get all orders
export const getAllOrders = createAsyncThunk("user/get-orders", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/user/orders')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//get order items by order id
export const getOrderItems = createAsyncThunk("user/orders/items", async(order_id, thunkAPI) => {
    try{
        const { data } = await axiosInstance.get(`/api/v1/user/order/items/${order_id}`)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//load user initially

export const loaduser = createAsyncThunk("user/loaduser", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/user/dashboard')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//update delivery address
export const updateAddress = createAsyncThunk("user/updateAddress", async(form, thunkAPI) => {
    try{
        const config = { headers : { "Content-Type" : "application/json" }};
        const { data } = await axiosInstance.post('/api/v1/user/updateAddress', form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//update user fullname
export const updateFullName = createAsyncThunk('user/updateFullName', async ({ email, fullname }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.post('/api/v1/user/updateUser', { email, fullname });
            return data;
        } catch(error){
            if(error.response){
                return thunkAPI.rejectWithValue(error.response.data)
            }else{
                return thunkAPI.rejectWithValue({ message: error.message })
            }
        }
    }
);
