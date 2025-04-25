import React, { useEffect, useRef, useState } from "react";
import ButtonLoader from "../ButtonLoader/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from "../../features/cart/cartThunks";
import { addToWishlist, removeFromWishlist } from "../../features/wishlist/wishlistThunks";

const ProductCard = ({ product }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
  
    const { loading, isAuthenticated } = useSelector((state) => state.user);
    const { cartLoading, cart } = useSelector((state) => state.cart)
    const {wishlistLoading, wishlist} = useSelector((state) => state.wishlist)
  
    // const [productCardHovered, setProductCardHovered] = useState(null)

    // const handleProductCardHover = (index) => {
    //     setProductCardHovered(index)
    //   }
    
    //   const handleMouseLeave = () => {
    //     setProductCardHovered(null)
    //   }

    const handleRemoveWishlistProduct = (product_id) => {
        dispatch(removeFromWishlist(product_id))
    }
  
    const handleAddToWishlist = (product_id) => {
      dispatch(addToWishlist(product_id))
  }
    
  const handleAddtoCart = (product_id) => {
    if(isAuthenticated){
      dispatch(addToCart(product_id))
      navigate('/cart')
    }else{
      toast.error("Login to add products to the cart")
    }
  }

  const handleGotoCart = () => {
    navigate("/cart")
  }

  return (
    <>
      <div
        key={product.id}
        // onMouseOver={() => handleProductCardHover(product.id)}
        // onMouseLeave={handleMouseLeave}
        className="relative flex flex-col bg-white w-[300px] h-fit shadow-lg border-[1px] border-lightGray3 rounded-[7px]"
      >
        {wishlist.find((item) => item.id === product.id) ? (
            <button
              disabled={wishlistLoading} 
            >
              <FavoriteIcon
                onClick={() => {handleRemoveWishlistProduct(product.id)}}  
                className="absolute top-[12px] right-[12px] text-primary cursor-pointer hover:text-secondary bg-white rounded-full p-[2px] shadow-md"
              />
            </button>
        ) : (                          
            <button
              disabled={wishlistLoading}
            >
              <FavoriteBorderIcon
                onClick={() => {handleAddToWishlist(product.id)}}
                className='absolute top-[12px] right-[12px] hover:text-primary cursor-pointer bg-white rounded-full p-[2px] shadow-md'
              />
            </button>
        )}
        <Link className="flex-center px-[0.5rem] py-[1rem]" to={`/product/${product.id}`}>
          <img
            className="h-[300px] object-contain"
            src={product.image_url}
            alt={product.name}
          />
        </Link>
        <div className="flex flex-col gap-[0.5rem] bg-[#f9f9f9] rounded-[0_0_7px_7px] px-[1rem] pt-[1rem] pb-[4.5rem]">
          <div className="flex flex-col">
            <Link to={`/product/${product.id}`} className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden text-[14px]">
                {product.name}
            </Link>
            <Rating
                name="text-feedback"
                value={4}
                readOnly
                precision={0.5}
                size="small"
                emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
            />
          </div>
          <div className="flex items-center gap-[0.5rem]">
            <div className="flex items-center gap-[0.5rem]">
              <p className="font-[Roboto] text-black font-semibold text-[17px]">
                ₹{new Intl.NumberFormat("en-IN").format(product.price)}
              </p>
              <p className="line-through font-[Roboto] text-[#777] text-[15px] font-normal">
                {product.mrp
                  ? `₹${new Intl.NumberFormat("en-IN").format(product.mrp)}`
                  : ""}
              </p>
            </div>
            {(product.stock <=5 && product.stock > 0) && (
              <p className="text-[12px] text-primary font-semibold">
                  Only {product.stock} items are left
              </p>
            )}
          </div>
        </div>
        {product.stock === 0 && ( 
          <button
            disabled={true}
            className={`absolute bottom-0 left-0 right-0 rounded-[0_0_7px_7px] bg-secondary disabled:bg-[#ffa1a1] h-[55px] text-white text-[13px] font-medium cursor-default 
          `}
          >
            Out of Stock
          </button>
        )}

        {product.stock > 0 && (
          !cart.find((p) => p.id === product.id) ? (
            <button
              onClick={() => handleAddtoCart(product.id)}
              disabled={cartLoading}
              className={`absolute bottom-0 left-0 right-0 rounded-[0_0_7px_7px] bg-black h-[55px] text-white text-[13px] hover:bg-darkGray font-medium transition-all duration-50 
            `}
            >
              {cartLoading ? (
                <ButtonLoader width={20} height={20} />
              ) : (
                <>Add to Cart</>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleGotoCart()}
              disabled={cartLoading}
              className={`absolute bottom-0 left-0 right-0 rounded-[0_0_7px_7px] bg-black h-[55px] text-white text-[13px] hover:bg-darkGray font-medium transition-all duration-50 
            `}
            >
              {cartLoading ? (
                <ButtonLoader width={20} height={20} />
              ) : (
                <>Go to Cart</>
              )}
            </button>
          )
        )}
      </div>
    </>
  );
};

export default ProductCard;
