import { Box, Button, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../../../layouts'
import { getOrderItemsBySellerId, updateOrderItemStatus } from '../../../features/seller/sellerThunks'
import { useParams } from 'react-router-dom'
import { orderStatus } from './data'
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 170,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '3px',
}


const SellerOrderItems = () => {

    const dispatch = useDispatch()
    const { order_id } = useParams()

  
    const { sellerLoading, sellerOrderItems, orderDeliveryAddress, allSellerOrders, sellerProducts } = useSelector((state) => state.seller)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [itemId, setItemId] = useState('')
    const [updateConfirmation, setUpdateConfirmation] = useState(false)
    const [orderS, setOrderS] = useState('')
    // const [deliveryAddressId, setDeliveryAddressId] = useState('')
    // const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState([])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const table_head_cell_properties = { color: 'white', fontWeight: "bold", fontFamily: "Montserrat, sans-serif"  }
    const table_body_cell_properties = { fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13 }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
 
    const handleStatusModalOpen = (item_id) => {
        setItemId(item_id)
        setUpdateConfirmation(true)
    }

    const handleUpdateModalClose = () => {
        setItemId('')
        setOrderS('')
        setUpdateConfirmation(false)
    }

    const handleOrderItemStatusUpdate = () => {
        setUpdateConfirmation(false)
        const updateStatusForm = new FormData
        if(itemId !== '' && orderS !== ''){
            updateStatusForm.set("order_id", order_id)
            updateStatusForm.set("item_id", itemId)
            updateStatusForm.set("status", orderS)
        }
        dispatch(updateOrderItemStatus(updateStatusForm))
        setPage(0)
    }

    //   useEffect(() => {
    //     if(deliveryAddressId !== ''){
    //         const address = deliveryAddress.find((addr) => addr.id === deliveryAddressId)
    //         setSelectedDeliveryAddress(address)
    //     }
    //   }, [deliveryAddressId])

      useEffect(() => {
        dispatch(getOrderItemsBySellerId(order_id)) 
      }, [dispatch, order_id])


  return (
    <>
        {sellerLoading ? (
            <Loader />
        ) : (
            <div className='min-h-[90vh] w-full pl-[6rem] pr-[2.5rem] py-[3rem] '>
                <div className='flex flex-col gap-[2rem]'>
                    <div className='w-full flex-center'>
                        <h1 className='font-extrabold text-[35px] text-mediumGray'>Order Details</h1>
                    </div>
                    <div className='flex gap-[1rem]'>
                        <div className='flex-[2] flex flex-col gap-[1rem]'>
                            {orderDeliveryAddress.map(addr => (
                                <div className='bg-white shadow-md rounded-[4px] pb-[1.5rem] flex flex-col gap-[0.5rem] border-[1px] border-lightGray3'>
                                    <h2 className='font-bold text-[16px] bg-primary rounded-[4px_4px_0_0] text-white px-[1.5rem] py-[1rem] mb-[0.3rem]'>Delivery Address</h2>
                                    <div className='flex flex-col px-[1.5rem]'>
                                        <div className='flex justify-between w-full relative'>
                                            <h3 className='font-bold text-[17px] mb-[0.2rem]'>{addr.fullname}</h3>
                                            <div className='flex flex-col absolute right-0 top-0'>
                                                <p className='text-[15px] '>Primary : {addr.mobile_number}</p>
                                                <p className='text-[15px] '>Alternative : {addr.alternate_phone_number}</p>
                                            </div>
                                        </div>
                                        <p className='text-[15px] max-w-[700px]'>{addr.address}, {addr.landmark}</p>
                                        <p className='text-[15px] max-w-[700px]'>{addr.city}, {addr.state}, India, {addr.pincode}</p>
                                    </div>
                                </div>
                            ))}
                            {/* <div className='bg-white shadow-md rounded-[4px] p-[1.5rem] flex flex-col gap-[0.5rem] border-[1px] border-lightGray3'>
                                <h2 className='font-semibold text-[18px] border-b-[1px] border-b-lightGray3 pb-[0.7rem] mb-[0.3rem] text-mediumGray'>Delivery Address</h2>
                                <div className='flex flex-col'>
                                    <h3 className='font-bold text-[17px] mb-[0.2rem]'>{selectedDeliveryAddress.fullname}</h3>
                                    <p className='text-[15px]'>{selectedDeliveryAddress.address}, {selectedDeliveryAddress.landmark}</p>
                                    <p className='text-[15px]'>{selectedDeliveryAddress.city}, {selectedDeliveryAddress.state}, India, {selectedDeliveryAddress.pincode}</p>
                                    <div className='flex gap-[1rem]'>
                                        <p className='text-[15px]'>{selectedDeliveryAddress.mobile_number}</p>
                                        <p className='text-[15px]'>{selectedDeliveryAddress.alternate_phone_number}</p>
                                    </div>
                                </div>
                            </div> */}
                            <TableContainer sx={{ boxShadow:5 }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="order items table">
                                    <TableHead>
                                        <TableRow  sx={{ bgcolor: '#ff5151' }}>
                                            <TableCell sx={{ ...table_head_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>Product</TableCell>
                                            <TableCell sx={{ ...table_head_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>Quantity</TableCell>
                                            <TableCell sx={{ ...table_head_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>Price</TableCell>
                                            <TableCell sx={{ ...table_head_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>MRP</TableCell>
                                            <TableCell sx={{ ...table_head_cell_properties, minWidth: 150, maxWidth: 150 }} align='right'>Status</TableCell>
                                            <TableCell sx={{ ...table_head_cell_properties, minWidth: 70, maxWidth: 70 }} align='center'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {sellerOrderItems.filter((order) => order.payment_status !== null).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ ...table_body_cell_properties, truncation_properties }} align='left'>
                                            <div className='flex items-center w-full gap-[0.5rem]'>
                                                <div className='max-w-[50px]'>
                                                    <img className='w-full h-full' src={item.image_url} alt={`${item.name} image`} />
                                                </div>
                                                <div className='overflow-hidden'>
                                                    <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{item.name}</p>
                                                    <p className='text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap'>ID: {item.id}</p>
                                                </div>
                                            </div>
                                            </TableCell>
                                            <TableCell sx={{ ...table_body_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>{item.quantity}</TableCell>
                                            <TableCell sx={{ ...table_body_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>₹{new Intl.NumberFormat('en-IN').format(item.price)}</TableCell>
                                            <TableCell sx={{ ...table_body_cell_properties, minWidth: 150, maxWidth: 150 }} align='left'>₹{new Intl.NumberFormat('en-IN').format(item.mrp)}</TableCell>
                                            <TableCell sx={{ ...table_body_cell_properties, minWidth: 150, maxWidth: 150, color: item.product_status === "Pending" ? 'red' : 'green' }} align='right'>{item.product_status}</TableCell>
                                            <TableCell sx={{ ...table_body_cell_properties, minWidth: 70, maxWidth: 70 }} align='center'>
                                            <div className='flex-center gap-[0.4rem]'>
                                                <IconButton onClick={() => {handleStatusModalOpen(item.id)}} aria-label='update' size='medium'><ModeEditIcon fontSize='inherit' /></IconButton>
                                                <Modal 
                                                    open={updateConfirmation}
                                                    onClose={handleUpdateModalClose}
                                                    >
                                                    <Box className="flex flex-col justify-between gap-[1rem]" sx={{...style, height: 220}}>
                                                        <p className='text-[18px]'>Update Order Status</p>
                                                        <select className={`cursor-pointer w-full bg-transparent border-[1px] border-lightGray2 hover:border-mediumGray rounded-[2px] py-[1rem] px-[1rem] ${orderS === '' ? "text-mediumGray2" : "text-black"} bg-white`} value={orderS} onChange={(e) => {setOrderS(e.target.value)}} required>
                                                            <option value="">Select Status</option>
                                                            {orderStatus.map((status, key) => (
                                                                <option key={key} className='text-mediumGray' value={status}>{status}</option>
                                                            ))}
                                                        </select>

                                                        <Button
                                                            variant='contained' 
                                                            color='primary' 
                                                            sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, height: '2.5rem' }}
                                                            onClick={handleOrderItemStatusUpdate}
                                                            disabled={orderS === '' ? true : false}>
                                                            Update
                                                        </Button>                                                    
                                                    </Box>
                                                </Modal>
                                            </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className='flex justify-end w-full'>
                                <TablePagination 
                                    component="div"
                                    rowsPerPageOptions={[5, 10, 15, 20, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={sellerOrderItems.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                        </div>
                        {/* <div className='flex flex-[0.8]'>
                            <div className='flex flex-col gap-[1.5rem] bg-white shadow-lg border-[1px] border-lightGray3 px-[1.5rem] py-[2rem] h-fit rounded-[4px] w-full'>
                                <h3 className='font-[Roboto] font-bold pb-[1.5rem] border-b-[1px] border-b-lightGray3'>Price Details ({orderItems.length} items)</h3>
                                <div className='flex flex-col gap-[1.5rem] border-b-[1px] border-b-lightGray3 pb-[1.5rem]'>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Price: </h4>
                                        <p className='font-[Roboto] text-[16px]'>₹{new Intl.NumberFormat('en-IN').format(totalPrice > 1000 ? totalPrice : totalPrice - 100)}</p>
                                    </span>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Delivery Charges: </h4>
                                        <p className={`font-[Roboto] text-[16px] ${totalPrice > 1000 ? 'text-[green]' : ''}`}>{totalPrice > 1000 ? "Free" : `₹${100}`}</p>
                                    </span>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Payment Status: </h4>
                                        <p className={`font-[Roboto] text-[16px] ${paymentStatus == "Completed" ? "text-[green]" : "text-[red]"}`}>{paymentStatus}</p>
                                    </span>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Payment Method: </h4>
                                        <p className={`font-[Roboto] text-[16px]`}>{paymentMethod}</p>
                                    </span>
                                    <span className='flex items-center justify-between'>
                                        <h4 className='font-[Roboto] flex font-medium text-[16px]'>Order Status: </h4>
                                        <p className={`font-[Roboto] text-[16px] ${orderStatus == "Delivered" ? "text-[green]" : "text-[red]"}`}>{orderStatus}</p>
                                    </span>
                                </div>
                                <span className='flex items-center justify-between'>
                                    <h4 className='font-[Roboto] flex font-semibold text-[18px]'>{paymentStatus == "Completed" ? "Total Paid: " : "Total Amount: "} </h4>
                                    <p className='font-[Roboto] text-[18px] font-medium'>₹{new Intl.NumberFormat('en-IN').format(totalPrice)}</p>
                                </span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )}
    </>
  )
}

export default SellerOrderItems