import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductDetails } from '../../../features/products/productsThunks'
import StarIcon from '@mui/icons-material/Star';
import { Loader } from '../../../layouts'
import { Breadcrumbs, Rating } from '@mui/material'
import { toast } from 'react-toastify';
import ButtonLoader from '../../../layouts/ButtonLoader/ButtonLoader';
import { addToCart } from '../../../features/cart/cartThunks';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import _ from 'lodash';
import ProductCard from '../../../layouts/ProductCard/ProductCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addToWishlist, removeFromWishlist } from '../../../features/wishlist/wishlistThunks';

const ProductDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated } = useSelector((state) => state.user)
  const { productDetails, productLoading, products } = useSelector((state) => state.products)
  const { cartLoading, cart } = useSelector((state) => state.cart)
  const { wishlist } = useSelector((state) => state.wishlist)

  const [categoryName, setCategoryName] = useState('')
  const [shuffledProducts, setShuffledProducts] = useState([]);

  const handleRemoveWishlistProduct = (product_id) => {
      dispatch(removeFromWishlist(product_id))
  }

  const handleAddToWishlist = (product_id) => {
    dispatch(addToWishlist(product_id))
}

  const {product_id} = useParams()

  const handleAddtoCart = (product_id) => {
    if(isAuthenticated){
      dispatch(addToCart(product_id))
      navigate('/cart')
    }else{
      toast.error("Login to add products to the cart")
    }
  }

  const handleGotoCart = () => {
    if(isAuthenticated){
      navigate('/cart')
    }else{
      toast.error("Login to add products to the cart")
    }
  }

  const filteredProducts = useMemo(() => {
      let filtered = [...products];
      if (categoryName) {
          filtered = filtered.filter(product => product.category === categoryName && product.id != product_id);
      }
      return filtered;
    }, [products, categoryName, productDetails]);

    useEffect(() => {
      setShuffledProducts(_.shuffle(filteredProducts).slice(0, 4));
  }, [filteredProducts]);

  useEffect(() => {
    dispatch(getProductDetails(product_id))
  }, [dispatch, product_id])

  useEffect(() => {
    if(productDetails.length > 0){
        setCategoryName(productDetails[0].category)
    }
  }, [productDetails])

  return (
    <>
      {productLoading ? (
        <Loader />
      ) : (
        <>
          <div className='w-full flex-center'>
              <div className='flex justify-start items-start max-w-[1200px] w-full mt-[1rem]'>
                  <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                      <Link to="/" className='hover:underline ' color="inherit">
                          Home
                      </Link>
                      <p className='text-primary text-ellipsis whitespace-nowrap overflow-hidden max-w-[170px]'>{productDetails.map((product) => product.name)}</p>
                  </Breadcrumbs>
              </div>
          </div>
          <div className='flex justify-center w-full py-[2rem]'>
            <div className='max-w-[1100px] w-full flex'>
              {productDetails.map((product, key) => (
                <div key={product.id} className='flex gap-[3rem]'>
                  <div className='flex-center'>
                    <img className='min-w-[450px] max-w-[450px] flex-1 p-[0.5rem] rounded-[10px]' src={product.image_url} alt={product.name} />
                  </div>
                  <div className='flex flex-col py-[2rem] gap-[2rem] flex-[2]'>
                    <div className='flex flex-col gap-[0.5rem]'>
                      <h2 className='font-extrabold text-[35px] '>{product.name}</h2>
                      <p className='text-lightGray text-[15px]'>#{product.category}</p>
                      <Rating
                        name="text-feedback"
                        value={4}
                        readOnly
                        precision={0.5}
                        size="large"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                    </div>
                    <div>
                      <p className='text-[green] font-medium text-[14px]'>Best Price</p>
                      <div className="flex items-center gap-[0.7rem]">
                          <p className="font-[Roboto] text-black font-semibold text-[30px]">₹{new Intl.NumberFormat('en-IN').format(product.price)}</p>
                          <p className="line-through font-[Roboto] text-[#777] text-[22px] font-normal">{product.mrp ? `₹${new Intl.NumberFormat('en-IN').format(product.mrp)}` : ""}</p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-[0.5rem]'>
                      <p className='font-bold text-[14px] text-darkGray2'>Description</p>
                      <p className='text-[14px] text-mediumGray '>
                        {product.description}
                      </p>
                    </div>
                    <div className='flex align-center gap-x-[2rem]'>
                      <div className='w-fit'>
                        {cart.find((item) => item.id === product.id) ? (
                            <button
                              onClick={() => handleGotoCart()}
                              disabled={cartLoading}  
                              className='bg-primary hover:bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] transition-all duration-150 py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]'>
                                {cartLoading ? (
                                  <ButtonLoader />
                                ) : (
                                    <>
                                      Go to Cart
                                    </>
                                )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddtoCart(product.id)}
                              disabled={cartLoading}  
                              className='bg-primary hover:bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] transition-all duration-150 py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]'>
                                {cartLoading ? (
                                  <ButtonLoader />
                                ) : (
                                      <>
                                        Add to Cart
                                      </>
                                    )
                                }
                            </button>
                          )}
                      </div>
                      {/* {wishlist.find((item) => item.id === product.id) ? (
                        <div
                          onClick={() => {handleRemoveWishlistProduct(product.id)}} 
                          className='px-[1.5rem] flex-center gap-x-[0.5rem] transition-all duration-150 py-[0.8rem] font-medium rounded-[3px] border-[2px] cursor-pointer border-primary hover:bg-tertiary'>
                          <FavoriteIcon className="text-primary"/>
                          <p>Wishlisted</p>
                        </div>
                      ) : (
                        <div 
                          onClick={() => {handleAddToWishlist(product.id)}}
                          className='px-[1.5rem] flex-center gap-x-[0.5rem] transition-all duration-150 py-[0.8rem] font-medium rounded-[3px] border-[2px] cursor-pointer border-primary hover:bg-tertiary'>
                          <FavoriteBorderIcon/>
                          <p>Add to Wishlist</p>
                        </div>                      
                      )} */}
                      {wishlist.find((item) => item.id === product.id) ? (
                          <FavoriteIcon 
                            fontSize="large"
                            onClick={() => {handleRemoveWishlistProduct(product.id)}}  
                            className="text-primary self-center cursor-pointer hover:text-secondary"
                          />
                      ) : (                          
                          <FavoriteBorderIcon
                            fontSize="large"
                            onClick={() => {handleAddToWishlist(product.id)}}
                            className='self-center hover:text-primary cursor-pointer'
                          />
                      )}
                    </div>
                  </div>
              </div>
              ))}
            </div>
          </div>

          {shuffledProducts.length > 0 && (
            <div className='flex flex-col w-full p-[5rem] gap-y-[2rem]'>
            <div className='flex justify-between'>
              <h1 className='heading'>
                Recommended Products
              </h1>
              <Link to={`/category/${categoryName.toLowerCase().trim().replace(' ', '')}`} className="flex-center bg-primary text-white px-[1.2rem] py-[0.4rem] border-[1px] border-primary hover:bg-secondary transition-colors duration-100 font-semibold rounded-[4px]">
                  View More
              </Link>
            </div>
            <div className='flex-center'>
              <div className='grid grid-cols-4 gap-[2rem]'>
                  {shuffledProducts.map((product, index) => (
                      <ProductCard product={product} />
                  ))}
              </div>
            </div>
          </div>
          )}
        </>
      )}
    </>
  )
}

export default ProductDetails