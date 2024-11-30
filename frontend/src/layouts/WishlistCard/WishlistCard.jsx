import React, { useEffect, useRef, useState } from "react";
import { Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "../../features/wishlist/wishlistThunks";

const WishlistCard = ({ product }) => {

    const dispatch = useDispatch()

    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleRemoveWishlistProduct = (product_id) => {
        setDeleteLoading(true)
        dispatch(removeFromWishlist(product_id)).then(
          () =>{
            setDeleteLoading(false)
          }
        )
    }


  return (
    <>
      <div
        key={product.id}
        className="relative flex flex-col bg-white w-[290px] h-fit shadow-lg border-[1px] border-lightGray3 rounded-[7px]"
      >
        <button disabled={deleteLoading}>
          <FontAwesomeIcon onClick={() => {handleRemoveWishlistProduct(product.id)}} icon={faTrashCan} style={{color: "#ff4246", position: 'absolute', top: '12px', right: '12px', fontSize: '21px', cursor: 'pointer'}} />
        </button>
        <div className="flex-center p-[2rem]">
          <img
            className="h-[120px]"
            src={product.image_url}
            alt={product.name}
          />
        </div>
        <div className="flex flex-col gap-[0.5rem] bg-[#f9f9f9] rounded-[0_0_7px_7px] px-[1.5rem] pt-[1.5rem] pb-[4.5rem]">
          <h3 className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
            {product.name}
          </h3>
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
        </div>
        <Link
          to={`/product/${product.id}`}
          className={`absolute bottom-0 left-0 right-0 flex-center rounded-[0_0_7px_7px] bg-black h-[55px] text-white text-[13px] hover:bg-darkGray font-medium transition-all duration-50`}
        >
            View Product
        </Link>
      </div>
    </>
  );
};

export default WishlistCard;
