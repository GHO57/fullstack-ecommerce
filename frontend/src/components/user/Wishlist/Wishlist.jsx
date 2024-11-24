import React, { useEffect } from 'react'
import WishlistCard from '../../../layouts/WishlistCard/WishlistCard'
import { useSelector } from 'react-redux'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wishlist = () => {

    const { wishlistLoading, wishlist } = useSelector((state) => state.wishlist)

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <>
        <div className='flex flex-col w-full min-h-screen my-[5rem]'>
            <div className='flex-center self-center gap-x-[1rem] my-[3rem]'>
                <FontAwesomeIcon icon={faHeart} style={{color: "#ff7174", fontSize: '35px'}} />
                <h1 className='font-extrabold text-[40px]'>Wishlist</h1>
            </div>
            <div className='flex justify-center w-full'>
                <div className='grid grid-cols-4 gap-[4rem]'>
                    {wishlist.map((product) => (
                        <WishlistCard product={product}/>
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default Wishlist