import React, { useEffect, useRef, useState } from "react";
import { Loader } from "../../../layouts";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "../../../layouts/Carousel/Carousel";
import CategoriesCarousel from "../../../layouts/CategoriesCarousel/CategoriesCarousel";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { FaTruckFast } from "react-icons/fa6";
import { RiCustomerServiceLine } from "react-icons/ri";
import { GoShieldCheck } from "react-icons/go";
import ProductCard from "../../../layouts/ProductCard/ProductCard";

const Home = () => {

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { adminLoading } = useSelector((state) => state.admin);
  const { productLoading, products, productDetails } = useSelector((state) => state.products)

  const items = [
    "/carousel-img-1.png",
    "/carousel-img-2.png",
    "/carousel-img-3.png",
    "/carousel-img-4.png",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <div className="flex items-center justify-between">
                  <h2 className="heading">
                    Explore Products
                  </h2>
                  <Link to="/products" className="bg-primary text-white px-[1.2rem] py-[0.4rem] border-[1px] border-primary hover:bg-secondary transition-colors duration-100 font-medium rounded-[2px]">
                      View All products
                  </Link>
                </div>
                <div className="flex-center flex-col gap-[3rem]">
                  <div className="grid grid-cols-4 gap-[2rem]">
                    {products.slice(0, 8).map((product) => (
                      <ProductCard product={product}/>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center my-[6rem]">
                <div className="flex max-w-[1000px] w-full justify-between">
                  <div className="flex-center flex-col gap-[1rem]">
                    <div className="flex-center text-white text-[45px] w-[120px] h-[120px] bg-black shadow-lg rounded-full">
                      <FaTruckFast />
                    </div>
                    <div className="flex-center flex-col">
                      <h3 className="font-bold text-[17px]">FREE AND FAST DELIVERY</h3>
                      <p className="text-[13px]">Free delivery for orders over ₹1000</p>
                    </div>
                  </div>
                  <div className="flex-center flex-col gap-[1rem]">
                    <div className="flex-center text-white text-[45px] w-[120px] h-[120px] bg-black shadow-lg rounded-full">
                      <RiCustomerServiceLine />
                    </div>
                    <div className="flex-center flex-col">
                      <h3 className="font-bold text-[17px]">24/7 CUSTOMER SERVICE</h3>
                      <p className="text-[13px]">Customer support is always there for you</p>
                    </div>
                  </div>
                  <div className="flex-center flex-col gap-[1rem]">
                    <div className="flex-center text-white text-[45px] w-[120px] h-[120px] bg-black shadow-lg rounded-full">
                      <GoShieldCheck />
                    </div>
                    <div className="flex-center flex-col">
                      <h3 className="font-bold text-[17px]">SECURE PAYMENTS</h3>
                      <p className="text-[13px]">Secure online transactions</p>
                    </div>
                  </div>
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
