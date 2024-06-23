import React, { useEffect, useState } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { addProduct } from '../../../features/seller/sellerThunks';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { categories } from '../data'


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  const Input = styled(TextField)(({ theme }) => ({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  }));

const AddProduct = ({ popup, setPopup }) => {

    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [mrp, setMrp] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState('')

    const handleAddProductForm = (event) => {
        event.preventDefault()

        const addProductForm = new FormData()

        addProductForm.set('name', name)
        addProductForm.set('description', desc)
        if(category !== ''){
            addProductForm.set('category', category)
        }
        addProductForm.set('price', Number(price))
        addProductForm.set('mrp', Number(mrp))
        addProductForm.set('stock', Number(stock))

        if(image){
            addProductForm.set('image', image)
        }
        

        dispatch(addProduct(addProductForm))
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleDescChange = (e) => {
        setDesc(e.target.value)
    }

    const handleCategorychange = (e) => {
        setCategory(e.target.value)
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value)
    }

    const handleMrpChange = (e) => {
        setMrp(e.target.value)
    }

    const handleStockChange = (e) => {
        setStock(e.target.value)
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0])
        setImageName(e.target.files[0].name)
    }

    const closeAddProduct = () => {
        setPopup(false)
    }

    useEffect(() => {
        if(!popup){
            setName('')
            setDesc('')
            setCategory('')
            setPrice('')
            setMrp('')
            setStock('')
            setImage(null)
            setImageName('')
        }
    }, [popup])

  return (
    <>
        {popup && (
            <div className='z-[6000] fixed left-0 top-0 right-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex-center backdrop-blur-[6px]'>
                <div className='relative flex-center w-[420px] h-auto bg-white shadow-xl border-lightGray3 border-[1px] rounded-[5px] px-[3rem] py-[2rem]'>
                    <FontAwesomeIcon 
                        className='z-[100] absolute top-2 right-2 cursor-pointer hover:text-mediumGray2' 
                        onClick={closeAddProduct}
                        icon={faClose}/>
                    <form className='w-full h-full flex-center flex-col gap-[2rem]' onSubmit={handleAddProductForm}>
                        <h3 className='text-[30px] font-extrabold text-mediumGray'>Add Product</h3>
                        <div className='flex-center flex-col gap-[1rem] w-full'>
                            <Input label="Name" variant='outlined' type="text" size='small' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={name} onChange={handleNameChange} required />
                            <Input label="Description" variant="outlined" type='text' multiline rows={3} size='small' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={desc} onChange={handleDescChange} required />
                            <select className={`cursor-pointer w-full bg-transparent border-[1px] border-lightGray2 hover:border-mediumGray rounded-[2px] py-[1rem] px-[1rem] ${category === '' ? "text-mediumGray2" : "text-black"} bg-white`} value={category} onChange={handleCategorychange} required>
                                <option className='text-mediumGray' value="">Category *</option>
                                {/* <option className='text-mediumGray' value="Food & Grocery">Food & Grocery</option>
                                <option className='text-mediumGray' value="Clothing">Clothing</option>
                                <option className='text-mediumGray' value="Electronics">Electronics</option>
                                <option className='text-mediumGray' value="Bags & Accessories">Bags & Accessories</option>
                                <option className='text-mediumGray' value="Kids">Kids</option>
                                <option className='text-mediumGray' value="Pet">Pet</option> */}
                                {categories.map((category, key) => (
                                    <option key={key} className='text-mediumGray' value={category}>{category}</option>
                                ))}
                            </select>
                            <Input label="Price" variant='outlined' type="number" size='small' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={price} onChange={handlePriceChange} required />
                            <Input label="MRP" variant='outlined' type="number" size='small' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={mrp} onChange={handleMrpChange} required />
                            <Input label="Stock" variant='outlined' type="number" size='small' InputProps={{ sx: { fontFamily: 'Montserrat, sans-serif', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '2px' } } }} InputLabelProps={{ sx: { fontFamily: 'Montserrat, sans-serif' } }} fullWidth value={stock} onChange={handleStockChange} required />
                            <Button
                                component="label"
                                role={undefined}
                                variant="outlined"
                                tabIndex={-1}
                                startIcon={imageName ? "" : <CloudUploadIcon />}
                                sx={{ width: "100%", fontFamily: 'Montserrat, sans-serif' }}
                            >
                                {imageName ? <p>{imageName}</p> : "Upload Image file"}
                                <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                            </Button>
                            <Button variant='contained' type='submit' sx={{ width: "100%", height: "2.5rem", fontFamily: 'Montserrat, sans-serif' }}>    
                                Add
                            </Button>
                        </div>
                    </form>
                </div>
            </div>  
        )}
    </>
  )
}

export default AddProduct