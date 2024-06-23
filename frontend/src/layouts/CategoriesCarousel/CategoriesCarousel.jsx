import React from 'react'
import { Link } from "react-router-dom";
import { categories } from "./data";
import {
    IoLaptopOutline,
    IoShirtOutline,
    IoHomeOutline,
    IoHeartOutline,
    IoFitnessOutline,
    IoGameControllerOutline,
    IoBookOutline,
    IoCarOutline,
    IoCartOutline,
    IoPawOutline,
    IoDocumentTextOutline,
  } from "react-icons/io5";
import { LiaBabyCarriageSolid } from "react-icons/lia";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { styled } from "@mui/material";


const CategoriesCarousel = () => {

    const CustomSlider = styled(Slider)`
        .slick-slide div{
            margin: 0 1rem;
            max-height: 200px;
            max-width: 200px;
        }
        .slick-arrow:before {
            content: "";
            font-family: "FontAwesome";
            color: black;
            background-color: var(--lightGray3);
            border-radius: 100%;
            font-size: 18px;
            padding: 0.7rem 0.8rem;
        }
        .slick-prev{
            top: -55px;
            left: 1170px;
        }
        .slick-next{
            top: -55px;
            right: 26px;
        }
        .slick-prev:before{
            content: "\\f060";
        }
        .slick-next:before{
            content: "\\f061";
        }
        `;

    const iconMap = {
        IoLaptopOutline: <IoLaptopOutline />,
        IoShirtOutline: <IoShirtOutline />,
        IoHomeOutline: <IoHomeOutline />,
        IoHeartOutline: <IoHeartOutline />,
        IoFitnessOutline: <IoFitnessOutline />,
        IoGameControllerOutline: <IoGameControllerOutline />,
        IoBookOutline: <IoBookOutline />,
        IoCarOutline: <IoCarOutline />,
        IoCartOutline: <IoCartOutline />,
        IoPawOutline: <IoPawOutline />,
        LiaBabyCarriageSolid: <LiaBabyCarriageSolid />,
        IoDocumentTextOutline: <IoDocumentTextOutline />,
    };

    const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 3,
    initialSlide: 0,
    };

    
  return (
    <>
        <CustomSlider {...settings}>
            {categories.map((category, index) => (
                <Link 
                    key={index}
                    to="/"
                    className="flex-center flex-col bg-white border-[1px] border-lightGray py-[2.5rem] rounded-[5px] text-black hover:bg-primary hover:border-primary hover:text-white transition-colors duration-150">
                    <div className="flex-center">
                        <p className="text-[30px] mb-[0.5rem]">{iconMap[category.icon]}</p>
                    </div>
                    <div className="flex-center">
                        <p className="font-semibold text-[12px]">{category.name}</p>
                    </div>
                </Link>
            ))}
        </CustomSlider>
    </>
  )
}

export default CategoriesCarousel