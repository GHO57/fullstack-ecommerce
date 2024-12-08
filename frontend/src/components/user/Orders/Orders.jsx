import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders } from '../../../features/user/userThunks'
import { Loader } from '../../../layouts'
import { Breadcrumbs, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';
import { Link, useNavigate } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const Orders = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, isAuthenticated, allOrders, orderItems } = useSelector((state) => state.user)
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [sortValue, setSortValue] = useState('')

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const table_head_cell_properties = { color: 'white', fontWeight: "bold", fontFamily: "Montserrat, sans-serif"  }
    const table_body_cell_properties = { fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13, border: '1px solid #ddd' }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };


    const handleSortValueChange = (e) => {
        setSortValue(e.target.value)
    }

    const handleInfoClick = (order_id) => {
        navigate(`/order/items/${order_id}`)
    }

    useEffect(() => {
        setPage(0)
    }, [sortValue])

    const sortOrders = (orders, sortValue) => {
        switch (sortValue) {
            case 'L2H':
                return [...orders].sort((a, b) => a.total - b.total);
            case 'H2L':
                return [...orders].sort((a, b) => b.total - a.total);
            default:
                return [...orders].sort((a, b) => a.created_at < b.created_at);
        }
    };

    const sortedOrders = useMemo(() => {
        return sortOrders(allOrders, sortValue);
    }, [allOrders, sortValue]) 

    useEffect(() => {
        dispatch(getAllOrders())
    }, [dispatch])
  return (
    <>
    { loading ? (
        <Loader/>
    ) : (
        <>
        <div className='min-h-screen w-full px-[5rem] py-[3rem]'>
            <div className='flex flex-col justify-center items-start w-full h-full gap-[1rem]'>
                {allOrders.length === 0 ? (
                    <div className='flex-center flex-col w-full pt-[3rem] gap-[1rem]'>
                        <div className='flex-center flex-col gap-[4rem] w-full'>
                            <img className='w-[25%]' src="/no-products.svg" alt="no products" />
                            <h2 className='font-extrabold text-[35px] text-mediumGray'>No Orders Found</h2>
                        </div>
                    </div>
                ):(
                <>
                    <div className='w-full flex-center mb-[1rem]'>
                        <div className='flex justify-start items-start max-w-[1380px] w-full'>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                                <Link to="/" className='hover:underline ' color="inherit">
                                    Home
                                </Link>
                                <p className='text-primary '>Orders</p>
                            </Breadcrumbs>
                        </div>
                    </div>
                    {/* <div className='flex justify-between w-full'>
                        <div className='flex gap-[1rem]'>
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
                    </div> */}
                    <TableContainer sx={{ boxShadow:5 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="orders table"> 
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#ff5151' }}>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Order ID</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Total Price</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Order Status</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Payment Status</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Payment Method</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="right">Order Date</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 70, maxWidth: 70}} align="center">Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : sortedOrders).map((order, key) => (
                                    <TableRow
                                        key={order.id}
                                    >
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 200, maxWidth: 200}} align="left">{order.id}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 300, maxWidth: 300}} align="left">₹{new Intl.NumberFormat('en-IN').format(order.total)}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150, color: order.status === "Pending" ? 'red' : 'green'}} align="left">{order.status}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150, color: order.payment_status === "Completed" ? 'green' : 'red'}} align="left">{order.payment_status}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150}} align="left">{order.payment_method}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150}} align="right">{order.created_at.split('T')[0]}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 70, maxWidth: 70}} align="center">
                                          <Tooltip title="more information" placement='left' arrow>
                                            <IconButton onClick={() => handleInfoClick(order.id)} aria-label='info' size='medium'>
                                              <InfoIcon />
                                            </IconButton>
                                          </Tooltip>
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
                            count={sortedOrders.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </>
                )}

            </div>
        </div>
    </>
    )}
    </>
  )
}

export default Orders