import React from 'react'

const LoginLoader = () => {
  return (
    <div className='flex-center gap-[1rem]'>
      <div className='h-7 w-7 border-primary border-solid border-[4px] border-r-transparent rounded-full animate-spin'>
      </div>
      <p>
        Loading...
      </p>
    </div>
  )
}

export default LoginLoader