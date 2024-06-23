import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../../../layouts'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToCart, deleteItem, removeFromCart } from '../../../features/cart/cartThunks';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { cartLoading, cartMessage, cartError, cart, totalItems, totalPrice, totalMRP } = useSelector((state) => state.cart)
  

    const [discount, setDiscount] = useState(0)

    const table_head_cell_properties = { fontSize: 15,fontWeight: "bold", fontFamily: "Montserrat, sans-serif", pt: 2, pb: 3, px: 2  }
    const table_body_cell_properties = { fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13, borderBottom: 0, py: 4, px: 2 }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const handleIncrementProduct = (product_id) => {
        dispatch(addToCart(product_id))
    }

    const handleDecrementProduct = (product_id) => {
        dispatch(removeFromCart(product_id))
    }

    const handleDeleteItem = (product_id) => {
        dispatch(deleteItem(product_id))
    }

    const handleCheckout = () => {
        navigate("/checkout")
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        setDiscount(totalMRP - totalPrice)
    },[totalMRP, totalPrice])
    
    return (
    <>
        {cartLoading ? (
            <Loader />
        ) : (cart.length === 0 ? (
                <div className='flex-center flex-col w-full py-[5rem] gap-[2rem]'>
                    <div className='w-full flex-center flex-col gap-[3rem]'>
                        <img className='max-w-[400px] w-full' src="/empty_cart.svg" alt="empty cart image" />
                        <h2 className='text-[30px] font-bold text-darkGray2'>Cart is Empty</h2>
                    </div>
                    <Link className='btn-fill rounded-[3px]' to="/products">
                        Add Some Products
                    </Link>
                </div>
            ) : (
                <div className='flex-center w-full py-[2rem]'>
                    <div className='max-w-[1280px] w-full flex gap-x-[1rem]'>
                        <div className='flex-[2]'>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{...table_head_cell_properties}} align='left'>Product</TableCell>
                                            <TableCell sx={{...table_head_cell_properties}} align='right'>Price</TableCell>
                                            <TableCell sx={{...table_head_cell_properties}} align='center'>Quantity</TableCell>
                                            <TableCell sx={{...table_head_cell_properties}} align='right'>Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ ...table_body_cell_properties, ...truncation_properties, maxWidth: 200 }} align='left'>
                                                    <div className='flex items-center w-full gap-[1.5rem]'>
                                                        <div className='max-w-[60px] max-h-[60px]'>
                                                            <img className='w-full h-full' src={item.image_url} alt={`${item.name} image`} />
                                                        </div>
                                                        <div className='overflow-hidden '>
                                                            <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{item.name}</p>
                                                            <p className='text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap'>ID: {item.id}</p>
                                                            <button onClick={() => handleDeleteItem(item.id)} className='mt-[1rem] font-semibold text-[15px] hover:text-primary transition-colors duration-100'>
                                                                REMOVE
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ ...table_body_cell_properties, fontFamily: 'Roboto, sans-serif' }} align='right'>
                                                    <span className='flex items-center justify-end gap-[0.5rem]'>
                                                        <p className='text-[16px] font-medium font-[Roboto]'>
                                                            ₹{new Intl.NumberFormat('en-IN').format(item.price)}
                                                        </p>
                                                        {item.mrp && (
                                                            <p className='line-through text-[12px] font-normal font-[Roboto] text-mediumGray3'>
                                                                ₹{new Intl.NumberFormat('en-IN').format(item.mrp)}
                                                            </p>
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell sx={{ ...table_body_cell_properties }} align='center'>
                                                    <div className='flex-center gap-[0.7rem]'>
                                                        <button onClick={() => handleDecrementProduct(item.id)} className='bg-primary p-[0.3rem] rounded-[2px] text-white hover:bg-secondary transition duration-150'>
                                                            <RemoveIcon sx={{ fontSize: '21px' }} />
                                                        </button>
                                                        <p>{item.quantity}</p>
                                                        <button onClick={() => handleIncrementProduct(item.id)} className='bg-primary p-[0.3rem] rounded-[2px] text-white hover:bg-secondary transition duration-150'>
                                                            <AddIcon sx={{ fontSize: '21px' }} />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                                <TableCell sx={{ ...table_body_cell_properties, fontFamily: 'Roboto, sans-serif', fontSize: '16px' }} align='right'>₹{new Intl.NumberFormat('en-IN').format(item.price * item.quantity)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className='flex flex-col flex-[0.8] p-[1rem] gap-[1.5rem]'>
                            <div className='flex flex-col gap-[1.5rem] border-l-[1px] border-l-lightGray3 pl-[1.5rem]'>
                                <h3 className='font-[Roboto] font-bold pb-[1.5rem] border-b-[1px] border-b-lightGray3'>Price Details ({totalItems} items)</h3>
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
                                <span className='flex items-center justify-between border-b-[1px] border-b-lightGray3 pb-[1.5rem]'>
                                    <h4 className='font-[Roboto] flex font-semibold text-[18px]'>Total Amount: </h4>
                                    <p className='font-[Roboto] text-[18px] font-medium'>₹{new Intl.NumberFormat('en-IN').format(totalPrice > 1000 ? totalPrice : totalPrice + 100)}</p>
                                </span>
                            </div>
                            <button onClick={handleCheckout} className='btn-fill w-[93%] h-[44px] self-end rounded-[3px] shadow-md hover:shadow-lg'>
                                CHECKOUT
                            </button>
                        </div>
                    </div>
                </div>
            )
        )}
    </>
  )
}

export default Cart