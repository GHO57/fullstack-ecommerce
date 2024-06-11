import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerOrders } from '../../../features/seller/sellerThunks';
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

    if (sellerLoading) return <Loader />;
    if (sellerError) return <Typography color="error">{sellerError}</Typography>;

    const fulfilledOrders = orders.filter(order => order.status === 'completed');
    const pendingOrders = orders.filter(order => order.status == 'pending');

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Seller Dashboard</Typography>
            <Box mb={3}>
                <Typography variant="h6">Statistics</Typography>
                {stats ? (
                    <Box>
                        <Typography>Total Sales: ${stats.totalSales.toFixed(2)}</Typography>
                        <Typography>Total Orders: {stats.totalOrders}</Typography>
                        <Typography>Total Products Sold: {stats.totalProductsSold}</Typography>
                    </Box>
                ) : (
                    <Typography>No statistics available.</Typography>
                )}
            </Box>
            <Box mb={3}>
                <Typography variant="h6">Fulfilled Order Items</Typography>
                <OrderTable orders={fulfilledOrders} />
                <Typography variant="h6" mt={3}>Pending Order Items</Typography>
                <OrderTable orders={pendingOrders} />
            </Box>
        </Box>
    );
};

const OrderTable = ({ orders }) => (
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
                    <TableRow key={item.id}>
                        <TableCell>{item.order_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default SellerDashboard;
