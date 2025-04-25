import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import axiosInstance from "../axiosInstance";

//admin login thunk

export const adminLogin = createAsyncThunk('admin/login', async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" }}
        const { data } = await axiosInstance.post('/api/v1/admin/login', form, config)

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//admin logout thunk

export const adminLogout = createAsyncThunk('admin/logout', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.post('/api/v1/admin/logout')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//get all users

export const adminGetAllUsers = createAsyncThunk('admin/get-all/users', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/admin/getallusers');

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data);
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//get all sellers

export const adminGetAllSellers = createAsyncThunk('admin/get-all/sellers', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/admin/getallsellers');

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data);
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//get all admins

export const adminGetAllAdmins = createAsyncThunk('admin/get-all/admins', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/admin/getalladmins');

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data);
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//get all seller applications

export const adminGetAllSellerApplications = createAsyncThunk('admin/get-all/seller/applications', async(thunkAPI) =>{
    try{
        const { data } = await axiosInstance.get('/api/v1/admin/getsellerapplications');

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data);
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//delete user

export const deleteUser = createAsyncThunk('admin/delete/user', async(id, thunkAPI) => {
    try{
        const { data } = await axiosInstance.delete(`/api/v1/admin/deleteuser/${id}`)

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//delete admin

export const deleteAdmin = createAsyncThunk('admin/delete/admin', async(id, thunkAPI) => {
    try{
        const { data } = await axiosInstance.delete(`/api/v1/admin/deleteadmin/${id}`)

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//delete seller

export const deleteSeller = createAsyncThunk('admin/delete/seller', async(id, thunkAPI) => {
    try{
        const { data } = await axiosInstance.delete(`/api/v1/admin/deleteseller/${id}`)

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})



//approve seller

export const approveSeller = createAsyncThunk('/admin/seller/approve', async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }

        const { data } = await axiosInstance.post('/api/v1/admin/approveseller', form, config);

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//reject seller

export const rejectSeller = createAsyncThunk('/admin/seller/reject', async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }

        const { data } = await axiosInstance.post('/api/v1/admin/rejectseller', form, config);

        return data;
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//change admin role

export const updateAdminRole = createAsyncThunk('/admin/updaterole', async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }

        const { data } = await axiosInstance.post('/api/v1/admin/changeadminrole', form, config)
        
        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})

//add new admin

export const addNewAdmin = createAsyncThunk('/admin/addnewadmin', async(form, thunkAPI) => {
    try{
        const config = { headers: { "Content-Type" : "application/json" } }

        const { data } = await axiosInstance.post('/api/v1/admin/addadmin', form, config)
        
        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})


//load admin user

export const loadadminuser = createAsyncThunk('admin/dashboard', async(thunkAPI) => {
    try{
        const { data } = await axiosInstance.get('/api/v1/admin/dashboard')

        return data
    }catch(error){
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data)
        }else{
            return thunkAPI.rejectWithValue({ message: error.message })
        }
    }
})