import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import axiosInstance from "../axiosInstance";


//add product to wishlist
export const addToWishlist = createAsyncThunk('user/wishlist/add', async(productId, thunkAPI) => {
    try{
        const config = { header: {"Content-Type" : "application/json"} }
        const { data } = await axiosInstance.post('/api/v1/wishlist/add', { "product_id" : productId }, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//remove product from wishlist

export const removeFromWishlist = createAsyncThunk("user/wishlist/remove", async(productId, thunkAPI) => {
    try{
        const { data } = await axiosInstance.delete(`/api/v1/wishlist/remove/${productId}`)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(message.response.message)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//load wishlist products

export const loadWishlist = createAsyncThunk("user/wishlist/getallproducts", async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get("/api/v1/wishlist/getallproducts")

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.message)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})