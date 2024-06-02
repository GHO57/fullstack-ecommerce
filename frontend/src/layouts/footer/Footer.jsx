import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookSquare, FaInstagramSquare, FaLinkedin  } from "react-icons/fa";
import { FaSquareXTwitter, FaStore, FaPhone  } from "react-icons/fa6";

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
      <div className='h-full w-full bg-[#fafafa] px-[5rem] py-[3rem]'>
        <div className='flex justify-between'>
          <div className='w-full flex flex-col justify-between'>
            <h2 className='text-[31px] font-extrabold text-primary cursor-default select-none'><img className='w-[210px]' src="/genie-logo.svg" alt="" /></h2>
            <div className='flex w-full text-[27px] gap-[2rem]'>
              <Link className='hover:text-primary transition-all duration-150'>
                <FaFacebookSquare />
              </Link>
              <Link className='hover:text-primary transition-all duration-150'>
                <FaInstagramSquare />
              </Link>
              <Link className='hover:text-primary transition-all duration-150'>
                <FaSquareXTwitter />
              </Link>
              <Link className='hover:text-primary transition-all duration-150'>
                <FaLinkedin />
              </Link>
            </div>
          </div>
          <div className='flex flex-col w-full gap-[1rem]'>
            <h3 className='font-semibold'>CATEGORY</h3>
            <div className='flex flex-col gap-[0.25rem]'>
              {Categories.map((category, key) => (
                <Link className='text-mediumGray2 hover:text-primary hover:font-semibold transition-all duration-100' key={key}>{category}</Link>
              ))}
            </div>
          </div>
          <div className='flex flex-col w-full gap-[0.7rem]'>
            <h3 className='font-semibold'>HELP</h3>
            <div className='flex flex-col gap-[0.25rem]'>
              {Help.map((help, key) => (
                <Link className='text-mediumGray2 hover:text-primary hover:font-semibold transition-all duration-100' key={key}>{help}</Link>
              ))}
            </div>
          </div>
          <div className='flex flex-col w-full gap-[0.7rem]'>
            <h3 className='font-semibold'>POLICY</h3>
            <div className='flex flex-col gap-[0.25rem]'>
              {Policy.map((policy, key) => (
                <Link className='text-mediumGray2 hover:text-primary hover:font-semibold transition-all duration-100' key={key}>{policy}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className='flex justify-between border-t-lightGray3 border-t-[1px] mt-[2rem] pt-[2rem]'>
          <p className='text-mediumGray2'>© genie 2024</p>
          <Link to="/seller" className='flex-center gap-[0.6rem] font-semibold hover:text-primary transition duration-300'><FaStore />Sell on Genie</Link>
          <Link className='flex-center gap-[0.6rem] font-semibold hover:text-primary transition duration-300'><FaPhone />Contact Us</Link>
        </div>
      </div>
    </>
  )
}

export default Footer