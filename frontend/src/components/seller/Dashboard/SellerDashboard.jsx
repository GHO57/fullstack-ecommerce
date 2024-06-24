import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerOrders, updateOrderStatus } from '../../../features/seller/sellerThunks';
import { Loader } from '../../../layouts';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { orders, stats, sellerLoading, sellerError } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(getSellerOrders());
    }, [dispatch]);

    useEffect(() => {
        console.log("Stats:", stats);
    }, [stats]);

    const handleUpdateStatus = (orderItemId) => {
        dispatch(updateOrderStatus({ orderItemId, item_status: 'Completed' }));
    };

    if (sellerLoading) return <Loader />;
    if (sellerError) return <Typography color="error">{sellerError}</Typography>;

    const fulfilledOrders = orders.filter(order => order.item_status === 'Completed');
    const pendingOrders = orders.filter(order => order.item_status === 'Pending');

    // Calculate product sales
    const productSales = orders.reduce((acc, order) => {
        if (!acc[order.product_name]) {
            acc[order.product_name] = 0;
        }
        acc[order.product_name] += parseFloat(order.price) * order.quantity;
        return acc;
    }, {});

    // Sort products by sales contribution
    const sortedProductSales = Object.entries(productSales).sort((a, b) => b[1] - a[1]);

    // Calculate total sales
    const totalSales = sortedProductSales.reduce((acc, [product, sales]) => acc + sales, 0);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Seller Dashboard</Typography>
            <Box mb={3}>
                <Typography variant="h6">Statistics</Typography>
                {stats ? (
                    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Sales</h2>
                            <p className="text-3xl font-bold text-white">₹{stats.totalSales.toFixed(2)}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Orders</h2>
                            <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Products Sold</h2>
                            <p className="text-3xl font-bold text-white">{stats.totalProductsSold}</p>
                        </div>
                    </Box>
                ) : (
                    <Typography>No statistics available.</Typography>
                )}
            </Box>
            <Box mb={3}>
                <Typography variant="h6">Product Ranking</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Sales</TableCell>
                                <TableCell>Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProductSales.map(([product, sales]) => (
                                <TableRow key={product}>
                                    <TableCell>{product}</TableCell>
                                    <TableCell>₹{sales.toFixed(2)}</TableCell>
                                    <TableCell>{((sales / totalSales) * 100).toFixed(2)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box mb={3}>
                <Typography variant="h6">Fulfilled Order Items</Typography>
                <OrderTable orders={fulfilledOrders} handleUpdateStatus={handleUpdateStatus} />
                <Typography variant="h6" mt={3}>Pending Order Items</Typography>
                <OrderTable orders={pendingOrders} handleUpdateStatus={handleUpdateStatus} />
            </Box>
        </Box>
    );
};

const OrderTable = ({ orders, handleUpdateStatus }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.map((item) => (
                    <TableRow key={item.item_id}>
                        <TableCell>{item.item_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                        <TableCell>
                            {item.item_status !== 'Completed' && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdateStatus(item.item_id)}
                                >
                                    Mark as Completed
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default SellerDashboard;
