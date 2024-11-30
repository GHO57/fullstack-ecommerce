import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import axiosInstance from "../axiosInstance";

//seller login thunk

export const sellerlogin = createAsyncThunk('seller/login', async(form, thunkAPI) => {
    try{
        const config = { headers: {"Content-Type" : "application/json"} }
        const { data } = await axiosInstance.post('/api/v1/seller/login', form, config)
        
        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//seller logout thunk

export const sellerlogout = createAsyncThunk('seller/logout', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.post('/api/v1/seller/logout')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//apply seller (new seller)

export const applySeller = createAsyncThunk('seller/apply', async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.post('/api/v1/seller/apply', form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//add product thunk

export const addProduct = createAsyncThunk('seller/product/add', async(form, thunkAPI) => {
    try{
        const { data } = await axiosInstance.post('/api/v1/seller/addproduct', form)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//delete product thunk

export const deleteProduct = createAsyncThunk('seller/product/delete', async(id, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.delete(`/api/v1/seller/deleteproduct/${id}`, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//delete multiple products thunk

export const deleteMultipleProducts = createAsyncThunk('seller/products/delete', async(productIdsArray, thunkAPI) => {
    try{
        const { data } = await axiosInstance.delete(`/api/v1/seller/deleteproducts?productIds=${productIdsArray.join('&productIds=')}`)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//restore product thunk

export const restoreProduct = createAsyncThunk('seller/product/restore', async(id, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.put(`/api/v1/seller/restoreproduct/${id}`, config)
        
        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//restore multiple products thunk

export const restoreMultipleProducts = createAsyncThunk('seller/products/restore', async(productIdsArray, thunkAPI) => {
    try{
        const { data } = await axiosInstance.put(`/api/v1/seller/restoreproducts?productIds=${productIdsArray.join('&productIds=')}`)
        
        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//update product thunk

export const updateProduct = createAsyncThunk('seller/product/update', async(form, thunkAPI) => {
    try{
        const { data } = await axiosInstance.put(`/api/v1/seller/updateproduct`, form)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

export const getSellerProducts = createAsyncThunk('seller/products', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/seller/getproducts')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


export const getSellerDeletedProducts = createAsyncThunk('seller/deleted-products', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/seller/getdeletedproducts')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//get product details
export const getProductDetails = createAsyncThunk('seller/productdetails', async(product_id, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.get(`/api/v1/seller/getproductdetails/${product_id}`, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})



//get all orders by seller id
export const getAllOrdersBySellerId = createAsyncThunk("seller/get-order", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/seller/orders')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//get order items by order id and seller id
export const getOrderItemsBySellerId = createAsyncThunk("seller/order/items", async(order_id, thunkAPI) => {
    try{
        const { data } = await axiosInstance.get(`/api/v1/seller/order/items/${order_id}`)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//update order item status
export const updateOrderItemStatus = createAsyncThunk("seller/order/item/update-status", async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }
        const { data } = await axiosInstance.post(`/api/v1/seller/order/item/updatestatus`, form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//load seller user

export const loadSeller = createAsyncThunk("seller/dashboard", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/seller/dashboard')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

export const getSellerOrders = createAsyncThunk('seller/getSellerOrders', async (_,thunkAPI) => {
    try {
        const { data } = await axiosInstance.get('/api/v1/seller/getsellerorders');
        return data;
    } catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
});