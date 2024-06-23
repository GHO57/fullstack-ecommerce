import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faAddressBook, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
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

const header = () => {

  const dispatch = useDispatch()

  const { loading, message, error, isAuthenticated, user } = useSelector((state) => state.user)
  const { adminLoading, adminMessage, adminError, isAdminAuthenticated, admin } = useSelector((state) => state.admin)
  const { sellerLoading, sellerMessage, sellerError, isSellerAuthenticated, seller } = useSelector((state) => state.seller)
  const { totalItems } = useSelector((state) => state.cart)

  const [showDropDown, setShowDropDown] = useState(false)
  const [showAdminDropDown, setShowAdminDropDown] = useState(false)
  const [showSellerDropDown, setShowSellerDropDown] = useState(false)
  const [popLogin, setPopLogin] = useState(false)

  
  const handleMouseHover = (isHovering) => {
    setShowDropDown(isHovering)
  }

  const handleAdminMouseHover = (isHovering) => {
    setShowAdminDropDown(isHovering)
  }

  const handleSellerMouseHover = (isHovering) => {
    setShowSellerDropDown(isHovering)
  }

  const openLogin = () => {
    setShowDropDown(false)
    setPopLogin(true)
  }


  const logout = () => {
    setShowDropDown(false)
    dispatch(logoutuser())
  }

  const adminlogout = () => {
    setShowAdminDropDown(false)
    dispatch(adminLogout())
  }

  const sellerLogout = () => {
    setShowSellerDropDown(false)
    dispatch(sellerlogout())
  }
  
  return (
    <>
    <Login trigger={popLogin} setTrigger={setPopLogin}/>
      <div className='flex-center w-full h-auto px-[5rem] py-[1.2rem]'>
        <div className='flex justify-between w-full'>
          <div className='flex-center'>
            <Link to="/" className='font-extrabold text-mediumGray text-[22px]'>
              <img className='w-[90px]' src="/genie-logo.svg" alt="" />
            </Link>
          </div>
          <div className='flex items-center text-mediumGray gap-[3rem] font-medium text-[14px]'>
            <div className='min-w-[350px] w-full rounded-[2px]'>
              <div className={`${popLogin ? 'z-[-1]' : 'z-0'} bg-transparent relative flex-center w-full rounded-[2px]`}>
                <input className='w-full pl-[3rem] pr-[1rem] py-[0.5rem] text-[14px] bg-[#f5f6f6] border-transparent border-[1px] rounded-[2px] focus:outline-none focus:border-mediumGray focus:border-[1px] focus:bg-white transition-colors duration-150' type="text" placeholder='Make a wish'/>
                <FontAwesomeIcon className='absolute left-[1rem] text-[#777]' icon={faMagnifyingGlass} />
              </div>
            </div>
            {isAdminAuthenticated && (
              <div className={`relative ${popLogin ? 'z-[-1]' : 'z-0'} flex-center h-full`} onMouseEnter={() => handleAdminMouseHover(true)} onMouseLeave={() => handleAdminMouseHover(false)}>
                <div className={`flex-center gap-[0.5rem] transition-colors duration-100 ${showAdminDropDown ? "text-primary" : ""}`}>
                  <RiShieldUserLine className='text-[18px]' />
                  <p>Admin</p>
                </div>
                <div className='absolute top-0 h-[60.5px] w-full hover:text-primary'>
                </div>
                  {showAdminDropDown && (
                    <div className={`bg-white absolute top-[60.5px] right-[-100px] w-[250px] shadow-[0_1px_10px_rgba(0,0,0,0.08)] border-[1px] border-[#f5f5f6] p-[1rem] rounded-[2px]`}>
                      <div className='flex flex-col gap-[1rem] font-normal items-start'>
                        <div className='border-b-[1px] border-lightGray3 w-full pb-[0.7rem]'>
                          <h2 className='font-bold text-[20px] text-darkGray2'>Hi,</h2>
                          <h2 className='truncate font-bold text-[25px] text-mediumGray3'>{admin[0].fullname.split(' ')[0]}</h2>
                        </div>
                        <div className='flex flex-col font-normal gap-[0.4rem] w-full border-b-[1px] border-lightGray3 pb-[1rem] mb-[0.3rem]'>
                          <Link onClick={() => {setShowAdminDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/admin/dashboard"><MdSpaceDashboard />Dashboard</Link>
                          {admin[0].role === "admin" && (
                            <Link onClick={() => {setShowAdminDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/admin/dashboard/admins"><FaUserShield />Manage Admins</Link>
                            )}
                          <Link onClick={() => {setShowAdminDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/admin/dashboard/users"><FaUser />Manage Users</Link>
                          <Link onClick={() => {setShowAdminDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/admin/dashboard/sellers"><FaShop />Manage Sellers</Link>
                          <Link onClick={() => {setShowAdminDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/admin/dashboard/seller/applications"><SiGoogleforms />Manage Applications</Link>
                          <Link onClick={() => {setShowAdminDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/admin/dashboard/orders"><TfiPackage />Manage Orders</Link>
                        </div>
                        <button className='btn-fill w-full'
                          onClick={adminlogout}
                          >
                          Logout
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                  )}    
            {isSellerAuthenticated && (
              <div className={`relative ${popLogin ? 'z-[-1]' : 'z-0'} flex-center h-full`} onMouseEnter={() => handleSellerMouseHover(true)} onMouseLeave={() => handleSellerMouseHover(false)}>
                <div className={`flex-center gap-[0.5rem] transition-colors duration-100 ${showSellerDropDown ? "text-primary" : ""}`}>
                  <PiStorefrontLight className='text-[18px]' />
                  <p>Seller</p>
                </div>
                <div className='absolute top-0 h-[60.5px] w-full'>
                </div>
                  {showSellerDropDown && (
                    <div className={`bg-white absolute top-[60.5px] right-[-100px] w-[250px] shadow-[0_1px_10px_rgba(0,0,0,0.08)] border-[1px] border-[#f5f5f6] p-[1rem] rounded-[2px]`}>
                      <div className='flex flex-col gap-[1rem] font-normal items-start'>
                        <div className='border-b-[1px] border-lightGray3 w-full pb-[0.7rem]'>
                          <h2 className='font-bold text-[20px] text-darkGray2'>Hi,</h2>
                          <h2 className='truncate font-bold text-[25px] text-mediumGray3'>{seller[0].full_name.split(' ')[0]}</h2>
                        </div>
                        <div className='flex flex-col font-normal gap-[0.4rem] w-full border-b-[1px] border-lightGray3 pb-[1rem] mb-[0.3rem]'>
                          <Link onClick={() => {setShowSellerDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/seller/dashboard"><MdSpaceDashboard />Dashboard</Link>
                          <Link onClick={() => {setShowSellerDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/seller/dashboard/products"><TfiPackage />Manage Products</Link>
                          <Link onClick={() => {setShowSellerDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/seller/dashboard/products/deleted"><FaTrash  />Deleted Products</Link>
                        </div>
                        <button className='btn-fill w-full'
                          onClick={sellerLogout}
                          >
                          Logout
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                  )} 
              <div className={`relative ${popLogin ? 'z-[-1]' : 'z-0'} flex-center h-full`} onMouseEnter={() => handleMouseHover(true)} onMouseLeave={() => handleMouseHover(false)}>
                <div className={`flex-center gap-[0.5rem] transition-colors duration-100 ${showDropDown ? "text-primary" : ""}`}>
                  <CiUser className='text-[18px]' />
                  <p>{isAuthenticated ? "Profile" : "Login"}</p>
                </div>
                <div className='absolute top-0 h-[60.5px] w-full'>
                </div>
                {showDropDown && (
                  isAuthenticated ? (
                    <div className={`bg-white absolute top-[60.5px] right-[-100px] w-[250px] shadow-[0_1px_10px_rgba(0,0,0,0.08)] border-[1px] border-[#f5f5f6] p-[1rem] rounded-[2px]`}>
                      <div className='flex flex-col gap-[1rem] font-normal items-start'>
                        <div className='border-b-[1px] border-lightGray3 w-full pb-[0.7rem]'>
                          <h2 className='font-bold text-[20px] text-darkGray2'>Hi,</h2>
                          <h2 className='truncate font-bold text-[25px] text-mediumGray3'>{user[0].fullname.split(' ')[0]}</h2>
                        </div>
                        <div className='flex flex-col font-normal gap-[0.4rem] w-full border-b-[1px] border-lightGray3 pb-[1rem] mb-[0.3rem]'>
                          <Link onClick={() => {setShowDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/account"><FontAwesomeIcon icon={faUser} />Account</Link>
                          <Link onClick={() => {setShowDropDown(false)}} className='text-mediumGray2 hover:text-primary hover:font-semibold flex items-center gap-[0.5rem]' to="/orders"><FontAwesomeIcon icon={faBox} />Orders</Link>
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
                    <div className={` bg-white absolute top-[60.5px] right-[-90px] w-[222px] shadow-[0_1px_10px_rgba(0,0,0,0.08)] border-[1px] border-[#f5f5f6] p-[1rem] rounded-[2px]`}>
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