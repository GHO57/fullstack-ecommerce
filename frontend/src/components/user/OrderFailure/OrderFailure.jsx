import React from 'react'
import { Link } from 'react-router-dom'
import ErrorIcon from '@mui/icons-material/Error';

const OrderFailure = () => {
  return (
    <>
        <div className='flex-center min-h-[80vh]'>
            <div className='flex-center gap-y-12 h-full flex-col shadow-md max-w-[600px] p-12 w-full rounded-md border-[1px] border-mediumGray4'>
                <div className='flex flex-col items-center gap-[1rem]'>
                    <ErrorIcon sx={{ fontSize: '90px' }} color='error' />
                    <h2 className='font-extrabold text-[27px]'>Payment Failed</h2>
                    <p className='text-[14px] text-mediumGray2 text-center'>If any amount has been deducted, it will be refunded to your original payment method within 5–7 business days. You can try again or contact support for assistance.</p>
                </div>
                <div className='flex justify-between w-full gap-[1rem]'>
                    <Link to="/orders" className='bg-white h-12 flex-center text-secondary hover:bg-secondary duration-150 hover:text-white font-medium w-full rounded-[3px] border-[1px] border-secondary'>
                        View Orders
                    </Link>
                    <Link to="/cart" className='bg-primary h-12 flex-center text-white hover:bg-secondary duration-150 font-medium w-full rounded-[3px]'>
                        Go to Cart
                    </Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default OrderFailure