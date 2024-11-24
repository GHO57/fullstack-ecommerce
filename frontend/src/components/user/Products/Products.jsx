import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../../features/cart/cartThunks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StarIcon from '@mui/icons-material/Star';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Rating, Select, Pagination, Breadcrumbs  } from '@mui/material';
import { Loader } from '../../../layouts';
import { categories } from '../data';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ProductCard from '../../../layouts/ProductCard/ProductCard';

const ITEM_HEIGHT = 48; 
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            borderRadius: 7
        },
    },
    MenuListProps: {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px'
        },
    },
};




const Products = () => {

    const { search_term } = useParams()

    const { productLoading, productDetails, products } = useSelector((state) => state.products)
    const { loading, isAuthenticated } = useSelector((state) => state.user);
  
    const [sortValue, setSortValue] = useState('')
    const [categoryName, setCategoryName] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
  
      const handleSortValueChange = (e) => {
        setSortValue(e.target.value)
      }

      const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
      }
    
      const sortProducts = (products, sortValue) => {
        switch (sortValue) {
            case 'L2H':
                return [...products].sort((a, b) => a.price - b.price);
            case 'H2L':
                return [...products].sort((a, b) => b.price - a.price);
            default:
                return products;
        }
    };
    
        const filterProducts = (products, categories, searchTerm) => {
        
            return products.filter(product => {
                const matchesCategory = categories.length === 0 || categories.includes(product.category)
                const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase())

                return matchesCategory && matchesSearchTerm
            })
        }
    
        const sortedAndFilteredProducts = useMemo(() => {
            return sortProducts(filterProducts(products, categoryName, search_term ? search_term : ''), sortValue);
        }, [products, categoryName, sortValue, search_term]) 

      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      const handleChangePage = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
      };
    
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = sortedAndFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
 
 
    return (
    <>
        {loading || productLoading ? (
            <Loader />
        ) : (
            <>
                <div className='flex flex-col w-full items-center py-[2rem] gap-[1rem]'>
                    <div className='flex justify-start items-start max-w-[1200px] w-full'>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link to="/" className='hover:underline ' color="inherit">
                                Home
                            </Link>
                            <p className='text-primary '>All Products</p>
                        </Breadcrumbs>
                    </div>
                    <div className='flex flex-col w-full max-w-[1200px] gap-[1rem]'>
                        <div className='w-full flex justify-end items-center gap-[2rem]'>
                            <FormControl size='small' sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Category</InputLabel>
                                <Select 
                                    value={categoryName} 
                                    onChange={handleCategoryNameChange}
                                    multiple
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    sx={{ borderRadius: '2px', textOverflow: 'ellipsis', maxWidth: 150 }}
                                    MenuProps={MenuProps}
                                    >
                                    {categories.map((category, key) => (
                                        <MenuItem key={key} value={category}>
                                            <Checkbox checked={categoryName.indexOf(category) > -1}  />
                                            <ListItemText primary={category} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size='small' sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Sort By</InputLabel>
                                <Select
                                    input={<OutlinedInput label="Tag" />} 
                                    value={sortValue} 
                                    onChange={handleSortValueChange}
                                    sx={{ borderRadius: '2px' }}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="L2H">Lowest to Highest Price</MenuItem>
                                    <MenuItem value="H2L">Highest to Lowest Price</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="flex-center w-full gap-[4rem]">
                            <div className="grid grid-cols-4 gap-[2rem]">
                            {currentProducts.map((product) => (
                                <ProductCard product={product}/>
                            ))}
                            </div>
                        </div>
                        <div className='flex-center w-full mt-[2rem]'>
                            <Pagination
                                count={Math.ceil(sortedAndFilteredProducts.length / productsPerPage)}
                                page={currentPage}
                                onChange={handleChangePage}
                                color="primary"
                            />
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
  )
}

export default Products