import React from 'react'

const ButtonLoader = ({ width=25, height=25, borderColor='white' }) => {
  return (
    <>
    <div className='flex-center gap-[1rem]'>
      <div style={{ width: `${width}px`, height: `${height}px`, borderColor: `${borderColor}`, borderStyle: 'solid', borderRightColor: 'transparent' }} className={`border-[3px] rounded-full animate-[spin_0.6s_linear_infinite]`}>
      </div>
    </div>
    </>
  )
}

export default ButtonLoader