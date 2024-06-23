import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter , FaStore, FaPhone, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

const Categories = [
  "Food & Groceries",
  "Clothing",
  "Electronics",
  "Bags & Accessories",
  "Kids",
  "Pet"
]

const Policy = [
  "Terms & Conditions",
  "Privacy",
  "Report Bug",
  "Returns & Cancellation",
]

const Help = [
  "Shipping",
  "Payments",
  "FAQ",
  "Report"
]


const Footer = () => {
  return (
    <>
      <div className='h-full w-full bg-[#000] px-[7rem] pt-[5rem]'>
        <div className='flex justify-between'>
          <div className='w-full flex flex-col justify-between flex-[1] '>
            <h2 className='text-[31px] font-extrabold text-primary cursor-default select-none'><img className='w-[160px]' src="/genie-logo-white.svg" alt="" /></h2>
            <div className='flex w-full text-[27px] gap-[2rem]'>
              <Link className='text-white hover:text-primary transition-all duration-150'>
                <FaFacebookF className='w-[13px]'  />
              </Link>
              <Link className='text-white hover:text-primary transition-all duration-150'>
                <FaInstagram className='w-[20px]' />
              </Link>
              <Link className='text-white hover:text-primary transition-all duration-150'>
                <FaXTwitter className='w-[20px]' />
              </Link>
              <Link className='text-white hover:text-primary transition-all duration-150'>
                <FaLinkedinIn className='w-[20px]' />
              </Link>
            </div>
          </div>
          <div className='flex justify-between flex-[2] w-full'>
            <div className='flex flex-col w-full gap-[1.2rem]'>
              <h3 className='font-semibold text-white'>CATEGORY</h3>
              <div className='flex flex-col gap-[0.4rem]'>
                {Categories.map((category, key) => (
                  <Link className='text-lightGray2 text-[15px] hover:text-white hover:font-semibold transition-all duration-100' key={key}>{category}</Link>
                ))}
              </div>
            </div>
            <div className='flex flex-col w-full gap-[1.2rem]'>
              <h3 className='font-semibold text-white'>HELP</h3>
              <div className='flex flex-col gap-[0.4rem]'>
                {Help.map((help, key) => (
                  <Link className='text-lightGray2 text-[15px] hover:text-white hover:font-semibold transition-all duration-100' key={key}>{help}</Link>
                ))}
              </div>
            </div>
            <div className='flex flex-col w-full gap-[1.2rem]'>
              <h3 className='font-semibold text-white'>POLICY</h3>
              <div className='flex flex-col gap-[0.4rem]'>
                {Policy.map((policy, key) => (
                  <Link className='text-lightGray2 text-[15px] hover:text-white hover:font-semibold transition-all duration-100' key={key}>{policy}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between border-t-mediumGray2 border-t-[1px] mt-[5rem] py-[2rem]'>
          <p className='text-lightGray2'>© genie 2024</p>
          <Link to="/seller" className='flex-center gap-[0.6rem] font-semibold text-white hover:text-primary transition duration-200'><FaStore />Sell on Genie</Link>
          <Link className='flex-center gap-[0.6rem] font-semibold text-white hover:text-primary transition duration-200'><FaPhone />Contact Us</Link>
        </div>
      </div>
    </>
  )
}

export default Footer