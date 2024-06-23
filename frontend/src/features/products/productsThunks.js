import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

//get all products

export const getAllProducts = createAsyncThunk('products/get-all', async(thunkAPI) => {
    try{
        const { data } = await axios.get('/api/v1/product/getallproducts')

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

export const getProductDetails = createAsyncThunk('products/get-details', async(thunkAPI) => {
    try{
        const { data } = await axios.get('/api/v1/product/getproductdetails')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})