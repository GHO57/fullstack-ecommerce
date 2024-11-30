import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faHeart, faAddressBook, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { CiUser } from "react-icons/ci";
import { PiShoppingCartSimple, PiStorefrontLight  } from "react-icons/pi";
import { RiShieldUserLine } from "react-icons/ri";
import { SiGoogleforms } from "react-icons/si";
import { MdSpaceDashboard, MdOutlineStorefront } from "react-icons/md";
import { FaShop, FaTrash, FaUserShield, FaUser } from "react-icons/fa6";
import { TfiPackage } from "react-icons/tfi";
import { useDispatch, useSelector } from 'react-redux';
import { Login } from "../../components"
import { logoutuser } from '../../features/user/userThunks';
import { adminLogout } from '../../features/admin/adminThunks';
import { sellerlogout } from '../../features/seller/sellerThunks';
import { Badge } from '@mui/material';
import { clearCartState } from '../../features/cart/cartSlice';

const header = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, message, error, isAuthenticated, user } = useSelector((state) => state.user)
  const { adminLoading, adminMessage, adminError, isAdminAuthenticated, admin } = useSelector((state) => state.admin)
  const { sellerLoading, sellerMessage, sellerError, isSellerAuthenticated, seller } = useSelector((state) => state.seller)
  const { totalItems } = useSelector((state) => state.cart)

  const [showDropDown, setShowDropDown] = useState(false)
  const [popLogin, setPopLogin] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  
  const handleMouseHover = (isHovering) => {
    setShowDropDown(isHovering)
  }

  const openLogin = () => {
    setShowDropDown(false)
    setPopLogin(true)
  }

  const handleSearch = (event) => {
    event.preventDefault();

    navigate(`/products/${searchTerm}`)
  }

  const logout = () => {
    setShowDropDown(false)
    dispatch(logoutuser()).then(() => {
      dispatch(clearCartState());
      navigate('/')
    })
  }

  return (
    <>
    <Login trigger={popLogin} setTrigger={setPopLogin}/>
      <div className='flex-center w-full h-auto px-[5rem] py-[1.2rem]'>
        <div className='flex justify-between w-full'>
          <div className='flex-center'>
            <Link to="/" className='font-extrabold text-mediumGray text-[22px]'>
              <img className='w-[80px]' src="/genie-logo.svg" alt="" />
            </Link>
          </div>
          <div className='flex items-center text-mediumGray gap-[3rem] font-medium text-[14px]'>
            <div className='min-w-[350px] w-full rounded-[2px]'>
              <form onSubmit={handleSearch} className={`${popLogin ? 'z-[-1]' : 'z-0'} bg-transparent relative flex-center w-full rounded-[2px]`}>
                <input onChange={(e) => setSearchTerm(e.target.value)} className='w-full pl-[3rem] pr-[1rem] py-[0.5rem] text-[14px] bg-[#f5f6f6] border-transparent border-[1px] rounded-[2px] focus:outline-none focus:border-mediumGray focus:border-[1px] focus:bg-white transition-colors duration-150' type="text" placeholder='Make a wish'/>
                <FontAwesomeIcon className='absolute left-[1rem] text-[#777]' icon={faMagnifyingGlass} />
              </form>
            </div>
            {isAdminAuthenticated && (
                <Link to='/admin/dashboard' className={`flex-center gap-[0.5rem] transition-colors duration-150 hover:text-primary`}>
                  <RiShieldUserLine className='text-[18px]' />
                  <p>Admin</p>
                </Link>
            )}    
            {isSellerAuthenticated && (
                <Link to="/seller/dashboard" className={`flex-center gap-[0.5rem] transition-colors duration-100 hover:text-primary`}>
                  <PiStorefrontLight className='text-[18px]' />
                  <p>Seller</p>
                </Link>
            )} 
              <div className={`relative ${popLogin ? 'z-[-1]' : 'z-0'} flex-center h-full`} onMouseEnter={() => handleMouseHover(true)} onMouseLeave={() => handleMouseHover(false)}>
                <div className={`flex-center gap-[0.5rem] transition-colors duration-100 ${showDropDown ? "text-primary" : ""}`}>
                  <CiUser className='text-[18px]' />
                  <p>{isAuthenticated ? "Profile" : "Login"}</p>
                </div>
                <div className='absolute top-0 h-[57.5px] w-full'>
                </div>
                {showDropDown && (
                  isAuthenticated ? (
                    <div className={`bg-white absolute top-[57.5px] right-[-100px] w-[250px] shadow-[0_1px_10px_rgba(0,0,0,0.08)] border-[1px] border-[#f5f5f6] p-[1rem] rounded-[2px]`}>
                      <div className='flex flex-col gap-[1rem] font-normal items-start'>
                        <div className='border-b-[1px] border-lightGray3 w-full pb-[0.7rem]'>
                          <h2 className='font-bold text-[20px] text-darkGray2'>Hi,</h2>
                          <h2 className='truncate font-bold text-[25px] text-mediumGray2'>{user[0].fullname.split(' ')[0]}</h2>
                        </div>
                        <div className='flex flex-col font-normal gap-[0.4rem] w-full border-b-[1px] border-lightGray3 pb-[1rem] mb-[0.3rem]'>
                          <Link onClick={() => {setShowDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/account"><FontAwesomeIcon icon={faUser} />Account</Link>
                          <Link onClick={() => {setShowDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/orders"><FontAwesomeIcon icon={faBox} />Orders</Link>
                          <Link onClick={() => {setShowDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/wishlist"><FontAwesomeIcon icon={faHeart} />Wishlist</Link>
                          <Link onClick={() => {setShowDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/contactus"><FontAwesomeIcon icon={faAddressBook} />Contact Us</Link>
                        </div>
                        <button className='btn-fill w-full'
                          onClick={logout}
                          >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={` bg-white absolute top-[57.5px] right-[-90px] w-[222px] shadow-[0_1px_10px_rgba(0,0,0,0.08)] border-[1px] border-[#f5f5f6] p-[1rem] rounded-[2px]`}>
                      <div className='flex flex-col gap-[1rem] font-normal items-start'>
                        <div>
                          <h2 className='font-bold text-[25px]'>Hello</h2>
                          <p className='text-mediumGray text-[13px]'>Login to access your account</p>
                        </div>
                        <button className='btn w-full'
                          onClick={openLogin}
                          >
                          Login/Signup
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            
            <Link className='flex-center gap-[0.5rem]' to="/cart">
                <Badge badgeContent={totalItems} color='primary'>
                  <PiShoppingCartSimple className='text-[19px]' />
                </Badge>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default header