import React, { useEffect, useState } from 'react';
import {
  Stepper, Step, StepLabel, Button, Typography, Box, TextField, Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDeliveryAddress, deleteDeliveryAddress, getAllOrders, getOrderItems } from '../../../features/user/userThunks';
import { Loader } from '../../../layouts';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart, loadCart } from '../../../features/cart/cartThunks';
import ButtonLoader from '../../../layouts/ButtonLoader/ButtonLoader';


const Checkout = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, isAuthenticated, user, deliveryAddress } = useSelector((state) => state.user)
  const { cart, totalItems, totalMRP, totalPrice } = useSelector((state) => state.cart)

  const table_head_cell_properties = { fontSize: 15,fontWeight: "bold", fontFamily: "Montserrat, sans-serif", pt: 2, pb: 3, px: 2  }
    const table_body_cell_properties = { fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13, borderBottom: 0, py: 4, px: 2 }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };


  const [activeStep, setActiveStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [orderSummary, setOrderSummary] = useState('');
  const [addressIndex, setAddressIndex] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState([])
  const [addNewAddress, setAddNewAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)

  const handleNext = () => {
    if(activeStep === 0 && selectedAddress.length !== 0){
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }else if(activeStep === 0 && selectedAddress.length === 0){
        toast.error("Select an Address")
    }else{
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleAddressSelect = (index, address) => {
    setAddressIndex(index)
    setSelectedAddress(address)
  }

  const handleAddAddress = () => {
    const addAddressForm = new FormData()

    addAddressForm.set("fullname", fullName)
    addAddressForm.set("phone_number", phoneNumber)
    addAddressForm.set("alternate_phone_number", alternatePhoneNumber)
    addAddressForm.set("pincode", pincode)
    addAddressForm.set("state", state)
    addAddressForm.set("city", city)
    addAddressForm.set("landmark", landmark)
    addAddressForm.set("address", address)

    dispatch(addDeliveryAddress(addAddressForm))

  }

  const handleAddressDelete = (address_id) => {
      dispatch(deleteDeliveryAddress(address_id))
  }

  const handleProceedCheckout = () => {
    setButtonLoading(true)
    if(paymentMethod === "UPI" || paymentMethod === "Card" || paymentMethod === "NetBanking"){
        if(totalPrice > 1000){
            handlePaymentGatewayOpen(totalPrice)
        }else{
            handlePaymentGatewayOpen(totalPrice + 100)
        }
    }else{
        setButtonLoading(false)
        toast.error("Select a payment method")
    }
  }

  const handlePaymentGatewayOpen = async(amount) => {

    const { data: { key } } = await axios.get('/api/v1/payment/getkey')
    const { data: { order } } = await axios.post('/api/v1/payment/checkout', {
        amount,
        paymentMethod,
        address_id: selectedAddress.id
    })

    if (!order){
        setButtonLoading(false)
        return
    };

    const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Genie',
        description: 'Genie - an eCommerce Web Application',
        image: "/genie-logo.svg",
        order_id: order.id,
        prefill: {
            name: selectedAddress.fullname,
            email: selectedAddress.email,
            contact: selectedAddress.mobile_number,
        },
        theme: {
            color: '#ff5151',
        },
        method: {
            netbanking: paymentMethod === 'NetBanking',
            card: paymentMethod === 'Card',
            upi: paymentMethod === 'UPI',
            wallet: false,
            emi: false,
            paylater: false
        },
        "handler": async (response) => {
            const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            };
      
            try {
              const { data } = await axios.post('/api/v1/payment/verification', verificationData);
              if (data.success) {
                setButtonLoading(false)
                dispatch(clearCart())
                dispatch(getAllOrders())
                dispatch(getOrderItems(verificationData.razorpay_order_id))
                navigate(`/checkout/success/${verificationData.razorpay_payment_id}`);
              } else {
                setButtonLoading(false)
                toast.error('Payment verification failed. Please contact support.');
              }
            } catch (error) {
              setButtonLoading(false)
              toast.error(`An error occurred during payment verification. Please try again.`);
            }
        },
        modal: {
            ondismiss: function() {
                handlePaymentFailure()
            }
        }
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  const handlePaymentFailure = () => {
    setButtonLoading(false)
    toast.error("Payment Cancelled or Failed");
  }

  useEffect(() => {
    setFullName('')
    setPhoneNumber('')
    setAlternatePhoneNumber('')
    setPincode('')
    setState('')
    setCity('')
    setLandmark('')
    setAddress('')
    setAddNewAddress(false)
    setSelectedAddress([])
    setAddressIndex(null)
  }, [deliveryAddress])

  useEffect(() => {
    dispatch(loadCart())
  }, [dispatch])

  return (
    <>
    {loading ? (
        <Loader />
    ):(
        <div className='w-full flex-center py-[2rem]'>
            <div className='max-w-[1080px] w-full flex flex-col gap-y-[2rem] min-h-[80vh]'>
                <Box sx={{ mt: 2, mb: 2 }}>
                    <>
                        {activeStep === 0 && (
                            deliveryAddress.length === 0 || addNewAddress ? (
                                <div className='flex-center w-full'>
                                    <div className='flex-center w-full'>
                                        <div className='flex flex-col max-w-[500px] flex-[0.7]'>
                                            <span className='flex items-start justify-between'>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Add Delivery Address</Typography>
                                                {deliveryAddress.length > 0 && (
                                                    <Button onClick={() => setAddNewAddress(false)} variant='contained' size='medium' sx={{ width: '25%', borderRadius: '2px' }}>
                                                        Go Back
                                                    </Button>
                                                )}
                                                <Button onClick={handleAddAddress} variant='contained' size='medium' sx={{ width: '17%', borderRadius: '2px' }}>
                                                    Add
                                                </Button>
                                            </span>
                                            <TextField
                                            fullWidth
                                            label="Full Name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            variant="outlined"
                                            inputProps={{ maxLength: 60 }}
                                            required
                                            sx={{ mb: 2 }}
                                            />
                                            <div className='flex gap-[1rem]'>
                                                <TextField
                                                fullWidth
                                                label="Phone Number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                variant="outlined"
                                                inputProps={{ maxLength: 10 }}
                                                required
                                                sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                fullWidth
                                                label="Alternate Phone Number"
                                                value={alternatePhoneNumber}
                                                onChange={(e) => setAlternatePhoneNumber(e.target.value)}
                                                variant="outlined"
                                                inputProps={{ maxLength: 10 }}
                                                sx={{ mb: 2 }}
                                                />
                                            </div>
                                            <div className='flex gap-[1rem]'>
                                                <TextField
                                                fullWidth
                                                label="Pincode"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                variant="outlined"
                                                required
                                                inputProps={{ maxLength: 6 }}
                                                sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                fullWidth
                                                label="State"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                variant="outlined"
                                                inputProps={{ maxLength: 30 }}
                                                required
                                                sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                fullWidth
                                                label="City"
                                                inputProps={{ maxLength: 30 }}
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                variant="outlined"
                                                required
                                                sx={{ mb: 2 }}
                                                />
                                            </div>
                                            <TextField
                                            fullWidth
                                            label="Landmark"
                                            value={landmark}
                                            onChange={(e) => setLandmark(e.target.value)}
                                            variant="outlined"
                                            inputProps={{ maxLength: 100 }}
                                            sx={{ mb: 2 }}
                                            />
                                            <TextField
                                            fullWidth
                                            label="Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            inputProps={{ maxLength: 200 }}
                                            required
                                            sx={{ mb: 2 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                        ):(
                        <Box>
                            <div className='w-full flex flex-col'>
                                <span className='flex justify-between'>
                                    <Typography variant="h6">Select a Delivery Address</Typography>
                                    <Button onClick={() => setAddNewAddress(true)} variant='outlined' startIcon={<AddIcon />} sx={{ borderRadius: '2px' }}>Add Address</Button>
                                </span>  
                                <div className='flex-center flex-col flex-[1] my-[2rem] gap-[1rem]'>
                                    <div className='flex flex-col w-full gap-[1rem]'>
                                        {deliveryAddress.map((address, index) => (
                                            <div key={index} onClick={() => handleAddressSelect(index, address)} className='relative py-[1.2rem] pr-[0.5rem] pl-[3rem] flex flex-col font-[Roboto] gap-[0.5rem] border-[1px] border-lightGray3 w-full rounded-[15px] shadow-md'>
                                                <RadioGroup sx={{ position: 'absolute', top: '1rem', left: 7 }} onChange={() => handleAddressSelect(index, address)}>
                                                    <Radio size='small' checked={index === addressIndex ? true : false}></Radio>
                                                </RadioGroup>
                                                <span className='flex items-center justify-between gap-[2rem]'>
                                                    <h2 className='font-bold text-[20px]'>
                                                        {address.fullname}
                                                    </h2>
                                                    <span className='flex gap-[2rem]'>
                                                        <p className='font-medium font-[Roboto] text-mediumGray text-[15px]'>{address.mobile_number}</p>
                                                        <p className='font-medium font-[Roboto] text-mediumGray text-[15px]'>{address.alternate_phone_number}</p>
                                                    </span>
                                                </span>
                                                <p className='font-[Roboto] text-mediumGray text-[14px] max-w-[500px]'>{address.address}, {address.state}, {address.city}, {address.pincode}, india, {address.landmark}</p>
                                                <span className='flex gap-[2rem]'>
                                                    <button onClick={() => handleAddressDelete(address.id)} className='font-[Roboto] text-primary font-medium'>
                                                        DELETE
                                                    </button>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <Link to="/cart" className="font-[Roboto] btn h-[40px] rounded-[3px] font-light text-[16px]">
                                        Go to Cart
                                    </Link>
                                    <Button onClick={handleNext} variant='contained' sx={{ width: '10%', borderRadius: '3px', height: 40 }}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </Box>
                            )
                        )}
                        {activeStep === 1 && (
                        <Box>
                            <div className='flex items-center justify-between'>
                                <Typography variant="h6" sx={{ mb: 2 }}>Order Summary & Payment</Typography>
                                <Button onClick={handleBack} variant='outlined' color="primary" sx={{ borderRadius: '1px' }}>
                                    back
                                </Button>
                            </div>
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
                                                                <p>{item.quantity}</p>
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
                                                <p className='font-[Roboto] text-[16px]'>₹{new Intl.NumberFormat('en-IN').format(totalPrice)}</p>
                                            </span>
                                            <span className='flex items-center justify-between'>
                                                <h4 className='font-[Roboto] flex font-medium text-[16px]'>Delivery Charges: </h4>
                                                <p className={`font-[Roboto] text-[16px] ${totalPrice > 1000 ? 'text-[green]' : ''}`}>{totalPrice > 1000 ? 'Free' : `₹${100}`}</p>
                                            </span>
                                        </div>
                                        <span className='flex items-center justify-between border-b-[1px] border-b-lightGray3 pb-[1.5rem]'>
                                            <h4 className='font-[Roboto] flex font-semibold text-[18px]'>Total Payable: </h4>
                                            <p className='font-[Roboto] text-[18px] font-medium'>₹{new Intl.NumberFormat('en-IN').format(totalPrice > 1000 ? totalPrice : totalPrice + 100)}</p>
                                        </span>
                                    </div>
                                    <FormControl sx={{ borderRadius: '1px' }}>
                                        <InputLabel id="demo-simple-select-label">Payment Method</InputLabel>
                                        <Select sx={{ borderRadius: '1px' }} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} label="Payment Method">
                                            <MenuItem value="UPI">UPI</MenuItem>
                                            <MenuItem value="Card">Credit/Debit Card</MenuItem>
                                            <MenuItem value="NetBanking">Net Banking</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className='flex justify-between items-center'>
                                        <Button
                                             onClick={handleProceedCheckout} 
                                             variant='contained' 
                                             sx={{ 
                                                width: '100%', 
                                                borderRadius: '3px', 
                                                height: 45, 
                                                '&.Mui-disabled': {
                                                    backgroundColor: '#ff9191', // Custom background color for disabled state
                                                    color: 'white', // Custom text color for disabled state
                                                }, }}
                                             disabled={buttonLoading}>
                                            {buttonLoading ? (
                                                <ButtonLoader/>
                                            ) : (
                                                <>
                                                    Pay
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                        )}
                    </>
                </Box>
            </div>
        </div>
    )}
    </>
  );
};

export default Checkout;
