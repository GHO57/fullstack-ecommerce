import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import axiosInstance from "../axiosInstance";

//get all products

export const getAllProducts = createAsyncThunk('products/get-all', async(params, thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/product/getallproducts', {
            params
        })

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

export const getProductDetails = createAsyncThunk('product/get-details', async(product_id, thunkAPI) => {
    try{
        const { data } = await axiosInstance.get(`/api/v1/product/getdetails/${product_id}`)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})