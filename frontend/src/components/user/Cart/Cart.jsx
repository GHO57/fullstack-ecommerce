import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../../../layouts'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToCart, deleteItem, loadCart, removeFromCart } from '../../../features/cart/cartThunks';
import { Link, useNavigate } from 'react-router-dom';
import ButtonLoader from '../../../layouts/ButtonLoader/ButtonLoader'

const Cart = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { cartLoading, cartMessage, cartError, cart, totalItems, totalPrice, totalMRP, totalValidProducts } = useSelector((state) => state.cart)
  

    const [itemLoading, setItemLoading] = useState({}) 
    const [discount, setDiscount] = useState(0)
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const table_head_cell_properties = { 
        fontSize: 15,
        fontWeight: "bold", 
        fontFamily: "Montserrat, sans-serif", 
        pt: 2.5, 
        pb: 2.5, 
        px: 2,
        color: 'white'
      }
    const table_body_cell_properties = { 
        fontFamily: "Montserrat, sans-serif", 
        fontWeight: 500, 
        fontSize: 13, 
        borderBottom: 1,
        borderColor: "#e5e5e5", 
        py: 4, 
        px: 2 
    }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const handleIncrementProduct = async (product_id) => {
        setItemLoading(prevState => ({ ...prevState, [product_id]: true }));
        dispatch(addToCart(product_id));
        setItemLoading(prevState => ({ ...prevState, [product_id]: false }));
    }

    const handleDecrementProduct = async (product_id) => {
        setItemLoading(prevState => ({ ...prevState, [product_id]: true }));
        dispatch(removeFromCart(product_id));
        setItemLoading(prevState => ({ ...prevState, [product_id]: false }));
    }

    const handleDeleteItem = async (product_id) => {
        setItemLoading(prevState => ({ ...prevState, [product_id]: true }));
        dispatch(deleteItem(product_id));
        setItemLoading(prevState => ({ ...prevState, [product_id]: false }));
    }

    const handleCheckout = () => {
        if(cart.length === totalValidProducts){
            navigate("/checkout")
        }else{
            setIsPopupOpen(true)
        }
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0)
        setDiscount(totalMRP - totalPrice)
    },[totalMRP, totalPrice])


    useEffect(() => {
        dispatch(loadCart())
    }, [dispatch])
    
    return (
    <>
        {cartLoading ? (
            <Loader />
        ) : ( cart.length === 0 ? (
                <div className='flex-center flex-col w-full py-[5rem] gap-[2rem]'>
                    <div className='w-full flex-center flex-col gap-[3rem]'>
                        <img className='max-w-[270px] w-full' src="/empty_cart.svg" alt="empty cart image" />
                        <h2 className='text-[27px] font-extrabold text-darkGray2'>Your Cart is Currently Empty!</h2>
                    </div>
                    <Link className='btn-fill rounded-[10px]' to="/products">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className='flex-center w-full py-[2rem]'>
                    <div className='max-w-[1380px] w-full flex gap-x-[1rem]'>
                        <div className='flex-[2]'>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow className='bg-primary'>
                                            <TableCell sx={{...table_head_cell_properties}} align='left'>Product</TableCell>
                                            <TableCell sx={{...table_head_cell_properties}} align='right'>Price</TableCell>
                                            <TableCell sx={{...table_head_cell_properties}} align='center'>Quantity</TableCell>
                                            <TableCell sx={{...table_head_cell_properties}} align='right'>Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ ...table_body_cell_properties, ...truncation_properties, maxWidth: 300 }} align='left'>
                                                    <div className='flex items-center w-full gap-[1.5rem]'>
                                                        <div className='max-w-[60px] max-h-[60px]'>
                                                            <img className='w-full h-full' src={item.image_url} alt={`${item.name} image`} />
                                                        </div>
                                                        <div className='overflow-hidden '>
                                                            <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{item.name}</p>
                                                            <p className='text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap'>ID: {item.id}</p>
                                                            <div className='flex gap-[1.5rem]'>
                                                                <button className='mt-[1rem] font-semibold text-[13px] hover:text-primary transition-colors duration-100'>
                                                                    MOVE TO WISHLIST
                                                                </button>
                                                                <button onClick={() => handleDeleteItem(item.id)} className='mt-[1rem] font-semibold text-[13px] hover:text-primary transition-colors duration-100'>
                                                                    REMOVE
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ ...table_body_cell_properties, fontFamily: 'Roboto, sans-serif' }} align='right'>
                                                    <span className='flex items-center justify-end gap-[0.5rem]'>
                                                        <p className='text-[18px] font-medium font-[Roboto]'>
                                                            ₹{new Intl.NumberFormat('en-IN').format(item.price)}
                                                        </p>
                                                        {item.mrp && (
                                                            <p className='line-through text-[14px] font-normal font-[Roboto] text-mediumGray3'>
                                                                ₹{new Intl.NumberFormat('en-IN').format(item.mrp)}
                                                            </p>
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell sx={{ ...table_body_cell_properties }} align='center'>
                                                    <div className="flex-center gap-[0.7rem]">
                                                        {(() => {
                                                            if (item.is_deleted === 1) {
                                                            // Render "Currently Unavailable" for deleted items
                                                            return <p className="text-secondary font-medium">Currently Unavailable</p>;
                                                            } else if (item.stock <= 0 && item.is_deleted === 0) {
                                                            // Render "Out of Stock" for items with zero or negative stock
                                                            return <p className="text-secondary font-medium">Out of Stock</p>;
                                                            } else if (itemLoading[item.id]) {
                                                            // Render loader if the item is loading
                                                            return <ButtonLoader borderColor="#ff5151" />;
                                                            } else {
                                                            // Render quantity controls if the item is available
                                                            return (
                                                                <>
                                                                <button
                                                                    onClick={() => handleDecrementProduct(item.id)}
                                                                    className="bg-primary p-[0.3rem] rounded-[2px] text-white hover:bg-secondary transition duration-150"
                                                                >
                                                                    <RemoveIcon sx={{ fontSize: "21px" }} />
                                                                </button>
                                                                <p>{item.quantity}</p>
                                                                <button
                                                                    onClick={() => handleIncrementProduct(item.id)}
                                                                    className="bg-primary p-[0.3rem] rounded-[2px] text-white hover:bg-secondary transition duration-150"
                                                                >
                                                                    <AddIcon sx={{ fontSize: "21px" }} />
                                                                </button>
                                                                </>
                                                            );
                                                            }
                                                        })()}
                                                    </div>

                                                </TableCell>
                                                <TableCell sx={{ ...table_body_cell_properties, fontFamily: 'Roboto, sans-serif', fontSize: '18px' }} align='right'>₹{new Intl.NumberFormat('en-IN').format(item.price * item.quantity)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className='flex flex-col flex-[0.65] p-[1.5rem] border-[1px] border-lightGray3 shadow-lg h-full max-h-fit'>
                            <div className='flex flex-col gap-[1.5rem] px-[0.5rem]'>
                                <h3 className='font-[Roboto] font-bold pb-[1rem] border-b-[1px] border-b-lightGray3'>Price Details ({totalItems} items)</h3>
                                <div className='flex flex-col gap-[1.5rem] border-b-[1px] border-b-lightGray3 pb-[1.5rem]'>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Price: </h4>
                                        <p className='font-[Roboto] text-[16px]'>₹{new Intl.NumberFormat('en-IN').format(totalMRP)}</p>
                                    </span>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Discount: </h4>
                                        <p className={`font-[Roboto] text-[16px] ${discount > 0 ? "text-[green]" : ""}`}>− ₹{new Intl.NumberFormat('en-IN').format(discount)}</p>
                                    </span>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Delivery Charges: </h4>
                                        <p className={`font-[Roboto] text-[16px] ${totalPrice > 1000 ? 'text-[green]' : ''}`}>{totalPrice > 1000 ? 'Free' : `₹${100}`}</p>
                                    </span>
                                </div>
                                <div className='flex flex-col gap-y-[0.5rem] pb-[1rem]'>
                                    <span className='flex item-center justify-between border-b-[1px] border-b-lightGray3 pb-[1.5rem] mb-[0.5rem]'>
                                        <h4 className='font-[Roboto] flex font-semibold text-[18px]'>Total Amount: </h4>
                                        <p className='font-[Roboto] text-[18px] font-medium'>₹{new Intl.NumberFormat('en-IN').format(totalPrice > 1000 ? totalPrice : totalPrice + 100)}</p>
                                    </span>
                                    <h4 className='font-[Roboto] text-[green] font-medium text-[17px] border-b-[1px] border-b-lightGray3 pb-[1rem]'>You will save ₹{new Intl.NumberFormat('en-IN').format(discount)} on this order!</h4>
                                </div>
                            </div>
                            <button onClick={handleCheckout} className='btn-fill w-full h-[47px] rounded-[3px] shadow-md hover:shadow-lg'>
                                CHECKOUT
                            </button>
                        </div>
                    </div>
                </div>
            )
        )}

        <Dialog open={isPopupOpen} onClose={closePopup} aria-labelledby="dialog-title" 
            sx={{ 
                zIndex: '10000',
                "& .MuiDialog-paper": { 
                    borderRadius: "3px",
                    padding: '1rem' 
                }
         }}>
            <DialogTitle sx={{ fontSize: "18px", marginBottom: "0.5rem" }} id="dialog-title">Few items are Unavailable</DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-[1rem]'>
                    {cart.filter((i) => i.stock <= 0 || i.is_deleted === 1).map((item) => (
                        <div className='flex gap-[1rem]'>
                            <img src={item.image_url} className='w-[40px]'/>
                            <div className='flex flex-col gap-[0.5rem] overflow-hidden'>
                                <h2 className='font-semibold text-[16px] text-ellipsis text-nowrap overflow-hidden'>{item.name}</h2>
                                <p className='text-secondary font-medium text-[13px]'>{item.is_deleted === 1? "Currently Unavailable" : "Out of Stock"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between", columnGap: "1rem" }}>
                <Button onClick={closePopup} color="primary" variant='outlined' sx={{ width: "100%", borderRadius: "3px", height: "45px" }}>
                    Cancel
                </Button>
                <Button onClick={() => navigate("/checkout")} color="primary" variant="contained" sx={{ width: "100%", borderRadius: "3px", height: "45px" }}>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default Cart