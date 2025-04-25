import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../../features/cart/cartThunks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StarIcon from '@mui/icons-material/Star';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Rating, Select, Pagination, Breadcrumbs, Typography  } from '@mui/material';
import { Loader } from '../../../layouts';
import { categoriesWithLinks } from '../data';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ProductCard from '../../../layouts/ProductCard/ProductCard';
import { getAllProducts } from '../../../features/products/productsThunks';

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




const CategorizedProducts = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { category: urlCategory } = useParams()

    const { productLoading, products, pagination } = useSelector((state) => state.products)
    const { loading, isAuthenticated } = useSelector((state) => state.user);
  
    const [sortBy, setSortBy] = useState('')
    const [sortValue, setSortValue] = useState('')
    const [sortOrder, setSortOrder] = useState('')
    const [categoryName, setCategoryName] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    
    
    const handleSortValueChange = (e) => {
        switch(e.target.value){
            case 'price_low_to_high' : 
                setSortValue(e.target.value)
                setSortBy('price')
                setSortOrder('asc')
                break;
            case 'price_high_to_low' :
                setSortValue(e.target.value)
                setSortBy('price')
                setSortOrder('desc')
                break
            default :
                setSortValue('')
                setSortBy('')
                setSortOrder('')
                break
        }
      }

      const fetchProducts = () => {
        const params = {
            page: currentPage,
            limit: productsPerPage,
            sortBy: sortBy,
            sortOrder: sortOrder,
            category: categoryName,
        }
        dispatch(getAllProducts(params))
      }

      useEffect(() => {
        fetchProducts()
        window.scrollTo(0, 0);
      }, [dispatch, currentPage, productsPerPage, sortBy, sortOrder, categoryName]);
      
      useEffect(() => {
        if (urlCategory) {
            const foundCategory = categoriesWithLinks.find(cat => cat.link === urlCategory);
            if (foundCategory) {
                setCategoryName([foundCategory.name])
            }
        }
      }, [urlCategory]);

        const handleChangePage = (event, value) => {
          setCurrentPage(value);
          window.scrollTo(0, 0);
        };
        
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
                            <p className='text-primary '>{categoryName}</p>
                        </Breadcrumbs>
                    </div>
                    {/* <h2 className='self-center font-extrabold text-darkGray text-[30px]'>{categoryName}</h2> */}
                    <div className='flex flex-col w-full max-w-[1200px] gap-[1rem]'>
                        <div className='w-full flex justify-end items-center gap-[2rem]'>
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
                                    <MenuItem value="price_low_to_high">Lowest to Highest Price</MenuItem>
                                    <MenuItem value="price_high_to_low">Highest to Lowest Price</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="flex-center w-full gap-[4rem]">
                            <div className={`${products.length > 0 ? "grid grid-cols-4 gap-[2rem]" : "flex-center"}`}>
                                {products.length > 0 ? (
                                    <>
                                        {products.map((product, index) => (
                                            <ProductCard product={product}/>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className='flex w-full text-center text-[35px] font-bold my-[5rem]'>
                                            <h3>We couldn't find the product you're looking for!</h3>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='flex-center w-full mt-[2rem]'>
                            <Pagination
                                count={Math.ceil(pagination.totalCount / productsPerPage)}
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

export default CategorizedProducts