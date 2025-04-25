import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogin } from "../../../features/admin/adminThunks"
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from "../../../layouts"

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { adminLoading, isAdminAuthenticated, admin, adminMessage, adminError } = useSelector((state) => state.admin)

  const handleLoginForm = (event) =>{
    event.preventDefault()

    const loginForm = new FormData()
    loginForm.set("email", email)
    loginForm.set("password", password)

    dispatch(adminLogin(loginForm))
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  useEffect(() => {
    if(isAdminAuthenticated){
      setEmail("")
      setPassword("")
      navigate("/admin/dashboard")
    }
  }, [isAdminAuthenticated])
  
  return (
    <>
      {adminLoading ? (
        <Loader />
      ) : (
        <div className='fixed left-0 top-0 w-full h-full bg-white'>

          <div className='flex-center w-full h-full'>
            <form className='max-w-[350px] w-full' onSubmit={handleLoginForm}>
              <div className='w-full p-[2rem] rounded-[5px] border-lightGray3 border-[1px] shadow-[0_1px_10px_2px_rgba(0,0,0,0.1)] flex-center flex-col gap-[3.2rem]'>
                  <div className='relative text-[25px] font-bold'>
                    Login
                  <div className='absolute bottom-[-8px] w-full h-[3px] bg-primary rounded-full'></div>
                  </div>
                  <div className='flex flex-col gap-[2.5rem] w-full'>
                    <input 
                      className={`w-full px-[1.2rem] py-[0.6rem] ${email.length > 0 ? "border-lightGray3 border-[1px]" : "bg-[#ebebeb]"} rounded-[2px] border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`}
                      type="email" 
                      placeholder='Email'
                      value={email}
                      onChange={handleEmailChange}
                      required 
                    />
                    <input 
                      className={`w-full px-[1.2rem] py-[0.6rem] ${password.length > 0 ? "border-lightGray3 border-[1px]" : "bg-[#ebebeb]"} rounded-[2px] border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`} 
                      type="password" 
                      placeholder='Password'
                      value={password}
                      onChange={handlePasswordChange}
                      required 
                    />
                  </div>
                  <div className='flex-center flex-col w-full gap-[1.5rem]'>
                    <button className='btn-fill w-full rounded-[2px]'>
                      Login
                    </button>
                    <Link className='underline text-[blue] hover:text-primary transition-all duration-150' to="/">Go to Home</Link>
                  </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Login