import React from 'react'
import { Link } from 'react-router-dom'

const SellerHeader = () => {

  return (
    <>
      <div className='flex-center w-full h-auto px-[5rem] py-[1.2rem]'>
        <div className='flex justify-between w-full'>
          <div className='flex-center'>
            <Link to="/" className='font-extrabold text-mediumGray text-[22px]'>
              <img className='w-[90px]' src="/genie-logo.svg" alt="" />
            </Link>
          </div>
          <div className='flex items-center gap-[1.5rem] font-medium text-[15px]'>
            <Link to="/seller/login" className='btn w-[125px] h-[40px] rounded-[3px]'>Login</Link>
            <Link to="/seller/apply" className='btn-fill w-[150px] h-[40px] rounded-[3px]'>Start Selling</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellerHeader