import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerOrders } from '../../../features/seller/sellerThunks';
import { Loader } from '../../../layouts';

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { orders, stats, sellerLoading, sellerError } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(getSellerOrders());
    }, [dispatch]);

    useEffect(() => {
        console.log("Stats:", stats);
    }, [stats]);

    if (sellerLoading) return <div>Loading...</div>;
    if (sellerError) return <div>Error: {sellerError}</div>;

    return (
        <div>
            <h2>Seller Dashboard</h2>
            <div>
                <h3>Statistics</h3>
                {stats ? (
                    <>
                        <p>Total Sales: ${stats.totalSales}</p>
                        <p>Total Orders: {stats.totalOrders}</p>
                        <p>Total Products Sold: {stats.totalProductsSold}</p>
                    </>
                ) : (
                    <p>No statistics available.</p>
                )}
            </div>
            <div>
                <h3>Orders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((item) => (
                            <tr key={item.id}>
                                <td>{item.order_id}</td>
                                <td>{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerDashboard;
