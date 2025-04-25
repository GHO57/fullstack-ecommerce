import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Loader } from '../../../layouts'
import { applySeller } from '../../../features/seller/sellerThunks'
import { TextField } from '@mui/material'

const Apply = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [companyAddress, setCompanyAddress] = useState('')
    const [gstin, setGstin] = useState('')

    const [hover, setHover] = useState(false)

    const { seller, sellerProducts, isSellerAuthenticated, sellerLoading, sellerMessage, sellerError } = useSelector((state) => state.seller)

    const handleApplicationForm = (event)=> {
        event.preventDefault()

        const applicationForm = new FormData()

        applicationForm.set("fullname", fullName)
        applicationForm.set("email", email)
        applicationForm.set("companyname", companyName)
        applicationForm.set("companyaddress", companyAddress)
        applicationForm.set("gstin", gstin)

        dispatch(applySeller(applicationForm))
    }

    const handleFullNameChange = (event) => {
        setFullName(event.target.value)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value)
    }

    const handleCompanyAddressChange = (event) => {
        setCompanyAddress(event.target.value)
    }

    const handleGstinChange = (event) => {
        setGstin(event.target.value)
    }

    return (
        <>
        {sellerLoading ? (
            <Loader />
          ) : (
            <div className='z-[5001] fixed left-0 top-0 w-full h-full bg-white'>
                <div className='bg-lightGray4 flex-center w-full h-full'>
                    <form onSubmit={handleApplicationForm}>
                        <div className='flex bg-white w-full max-w-[1000px] rounded-[5px] border-lightGray3 border-[1px] shadow-[0_1px_10px_2px_rgba(0,0,0,0.1)]'>
                            <div className='flex-1 relative bg-primary flex flex-col w-full justify-between text-[25px] rounded-[5px_0_0_5px] text-white px-[3rem] py-[5rem] font-bold'>
                                <img className='w-[280px] self-center' src="/genie-logo-white.svg" alt="logo" />
                                <p className='text-[13px] font-light text-lightGray4'>
                                    By applying for seller account, I accept <Link className='underline hover:text-white' to="/terms-and-conditions">Terms & Conditions</Link> & <Link className='underline hover:text-white' to="/privacy-policy">Privacy Policy</Link>.
                                </p>
                                <div className='flex justify-between w-full'>
                                    <Link className='btn w-[50%] rounded-[3px] text-[15px] hover:bg-tertiary hover:text-primary' to="/seller/login">Already a Seller?</Link>
                                    <Link onMouseOver={() => {setHover(true)}} onMouseLeave={() => {setHover(false)}} className={`text-[15px] text-white flex-center gap-[3px]`} to="/">Go to Home <p className={`text-[20px] ${hover ? "mr-[-4px] ml-[4px]" : ""} transition-all`}>&#10142;</p></Link>
                                </div>
                            </div>
                            <div className='flex-[1.5] flex flex-col gap-[1.5rem] rounded-[5px_0_0_5px] w-full px-[2.2rem] py-[3rem]'>
                                <h3 className='text-[33px] font-bold text-mediumGray'>
                                    Seller Application
                                </h3>
                                <div className='flex flex-col gap-[2rem]'>
                                    <div className='flex gap-[1.5rem]'>
                                        {/* <input 
                                        className={`w-full px-[1.2rem] py-[0.8rem] ${fullName.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`} 
                                        type="text" 
                                        placeholder='Full Name'
                                        value={fullName}
                                        onChange={handleFullNameChange}
                                        required 
                                        />
                                        <input 
                                        className={`w-full px-[1.2rem] py-[0.8rem] ${email.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`}
                                        type="email" 
                                        placeholder='Email'
                                        value={email}
                                        onChange={handleEmailChange}
                                        required 
                                        /> */}
                                        <TextField id="outlined" label="Full Name" type='text' variant="outlined" size='normal' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={fullName} onChange={handleFullNameChange} required />
                                        <TextField id="outlined" label="Email" type='email' variant="outlined" size='normal' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={email} onChange={handleEmailChange} required />
                                    </div>
                                    <div className='flex gap-[1.5rem]'>
                                        {/* <input 
                                        className={`w-full px-[1.2rem] py-[0.8rem] ${gstin.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`} 
                                        type="tel" 
                                        placeholder='GSTIN'
                                        value={gstin}
                                        onChange={handleGstinChange}
                                        maxLength={15}
                                        required 
                                        />
                                        <input 
                                        className={`w-full px-[1.2rem] py-[0.8rem] ${companyName.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`} 
                                        type="text" 
                                        placeholder='Company Name'
                                        value={companyName}
                                        onChange={handleCompanyNameChange}
                                        required 
                                        /> */}
                                        <TextField id="outlined" label="GSTIN" type='text' variant="outlined" size='normal' inputProps={{ maxLength: 15 }} InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={gstin} onChange={handleGstinChange} required />
                                        <TextField id="outlined" label="Company Name" type='text' variant="outlined" size='normal' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={companyName} onChange={handleCompanyNameChange} required />
                                    </div>
                                    <TextField id="outlined" label="Company Address" type='text' multiline rows={3} variant="outlined" size='normal' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={companyAddress} onChange={handleCompanyAddressChange} required />
                                    {/* <textarea
                                        className={`w-full resize-none px-[1.2rem] py-[0.8rem] ${companyAddress.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`} 
                                        placeholder='Company Address'
                                        value={companyAddress}
                                        onChange={handleCompanyAddressChange}
                                        rows={3}
                                        required>
                                        
                                    </textarea> */}
                                </div>
                                <div className='flex flex-col w-full gap-[1.5rem]'>
                                    <button className='btn-fill w-full h-[3.1rem] rounded-[2px] text-[18px]'>
                                    Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>            
          )}
        </>
      )
}

export default Apply