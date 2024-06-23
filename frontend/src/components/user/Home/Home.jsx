import React, { useEffect, useRef, useState } from "react";
import { Loader } from "../../../layouts";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "../../../layouts/Carousel/Carousel";
import CategoriesCarousel from "../../../layouts/CategoriesCarousel/CategoriesCarousel";
import { Button, Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from "../../../features/cart/cartThunks";

const Home = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { adminLoading } = useSelector((state) => state.admin);
  const { productLoading, products, productDetails } = useSelector((state) => state.products)

  const [productCardHovered, setProductCardHovered] = useState(null)

  const items = [
    "/carousel-img-1.png",
    "/carousel-img-2.png",
    "/carousel-img-3.png",
    "/carousel-img-4.png",
  ];

  const handleProductCardHover = (index) => {
    setProductCardHovered(index)
  }

  const handleMouseLeave = () => {
    setProductCardHovered(null)
  }

  const handleAddtoCart = (product_id) => {
    if(isAuthenticated){
      dispatch(addToCart(product_id))
      navigate('/cart')
    }else{
      toast.error("Login to add products to the cart")
    }
  }

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <>
      {loading || adminLoading ? (
        <Loader />
      ) : (
        <div className="flex-center py-[2rem]">
          <div className="max-w-[1280px] flex flex-col w-full gap-y-[4rem]">
            <Carousel items={items} />
            <div className="max-w-[1280px] w-full flex flex-col gap-y-[4rem]">
              <div className="flex flex-col gap-y-[2rem] w-full border-b-[1px] border-b-lightGray3 pb-[4rem]">
                  <h2 className="heading">
                    Browse By Category
                  </h2>
                <CategoriesCarousel />
              </div>
              <div className="flex flex-col gap-y-[2rem]">
                <h2 className="heading">
                  Explore Products
                </h2>
                <div className="flex-center flex-col gap-[3rem]">
                  <div className="grid grid-cols-4 gap-[2rem]">
                    {products.map((product, index) => (
                      <div 
                        key={index}
                        onMouseOver={() => handleProductCardHover(index)} 
                        onMouseLeave={handleMouseLeave} 
                        className="relative flex flex-col bg-white w-[280px] h-fit shadow-lg border-[1px] border-lightGray4 rounded-[3px]"
                        >
                        <Link className="flex-center p-[2rem]" to={`/product/${product.id}`}>
                          <VisibilityOutlinedIcon className="absolute top-3 right-3"/>
                          <img className="h-[120px]" src={product.image_url} alt={product.name} />
                        </Link>
                        <div className="flex flex-col gap-[0.5rem] bg-[#fafafa] rounded-[0_0_3px_3px] px-[1.5rem] pt-[1.5rem] pb-[3.2rem]">
                          <h3 className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">{product.name}</h3>
                          <div className="flex items-center gap-[0.5rem]">
                              <p className="font-[Roboto] text-black font-semibold text-[17px]">₹{new Intl.NumberFormat('en-IN').format(product.price)}</p>
                              <p className="line-through font-[Roboto] text-[#777] text-[15px] font-normal">{product.mrp ? `₹${new Intl.NumberFormat('en-IN').format(product.mrp)}` : ""}</p>
                          </div>
                          <Rating
                            name="text-feedback"
                            value={4}
                            readOnly
                            precision={0.5}
                            size="medium"
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                        </div>
                          <button
                            onClick={() => handleAddtoCart(product.id)} 
                            className={`absolute bottom-0 left-0 right-0 rounded-[0_0_3px_3px] bg-black h-[40px] text-white text-[13px] hover:bg-darkGray font-medium transition-all duration-50 ${productCardHovered === index ? "opacity-1" : "opacity-0"}`} >
                            Add to Cart
                          </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/products">
                    <Button variant="contained" sx={{ fontFamily: 'Montserrat, sans-serif', px: '1.9rem', py: '0.7rem' }}>
                      View All products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Home;
