import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Previous"
    className="flex-center absolute left-[-1.15rem] top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 shadow-md rounded-full p-2 transition-colors duration-300 hover:bg-opacity-100 z-10"
  >
    <KeyboardArrowLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Next"
    className="flex-center absolute right-[-1.15rem] top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 shadow-md rounded-full p-2 transition-colors duration-300 hover:bg-opacity-100 z-10"
  >
    <KeyboardArrowRight />
  </button>
);

const Carousel = ({ items }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    pauseOnHover: true,
    draggable: false,
  };


  return (
    <Slider 
        {...settings}
    >
      {items.map((item, index) => (
        <div key={index}>
          <img src={item} alt={`Slide ${index}`} className="w-full h-auto rounded-[10px]" />
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
