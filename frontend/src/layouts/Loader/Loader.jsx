import React from 'react'

const Loader = () => {
  return (
    <div className='flex-center fixed top-0 left-0 right-0 w-full h-full bg-white z-[10000]'>
          <div className='w-[45px] h-[45px] border-primary border-[3px] border-solid border-r-transparent border-b-transparent rounded-full animate-[spin_0.5s_linear_infinite]'>
            
          </div>
    </div>
  )
}

export default Loader