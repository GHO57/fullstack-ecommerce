import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerOrders } from "../../../features/seller/sellerThunks";
import { Loader } from "../../../layouts";
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
} from "@mui/material";

const SellerDashboard = () => {
    const dispatch = useDispatch();
    const { orders, stats, sellerLoading, sellerError } = useSelector(
        (state) => state.seller,
    );

    useEffect(() => {
        dispatch(getSellerOrders());
    }, [dispatch]);

    if (sellerLoading) return <Loader />;
    if (sellerError)
        return <Typography color="error">{sellerError}</Typography>;

    // Calculate product sales
    const productSales = orders.reduce((acc, order) => {
        if (!acc[order.product_name]) {
            acc[order.product_name] = 0;
        }
        acc[order.product_name] +=
            parseFloat(order.order_item_price) * order.quantity;
        return acc;
    }, {});

    // Sort products by sales contribution
    const sortedProductSales = Object.entries(productSales).sort(
        (a, b) => b[1] - a[1],
    );

    // Calculate total sales
    const totalSales = sortedProductSales.reduce(
        (acc, [sales]) => acc + sales,
        0,
    );

    return (
        <Box sx={{ pl: "6rem", pr: "2.5rem", py: "3rem" }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 800,
                    fontSize: "35px",
                    color: "#111",
                    textAlign: "center",
                }}
            >
                Seller Dashboard
            </Typography>
            <Box mb={3}>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        color: "#111",
                    }}
                >
                    Statistics
                </Typography>
                {stats ? (
                    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="stat bg-primary p-4 rounded-sm shadow-lg">
                            <h2 className="text-xl font-semibold text-white">
                                Total Sales
                            </h2>
                            <p className="text-3xl font-bold text-white">
                                ₹{stats.totalSales.toFixed(2)}
                            </p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-lg">
                            <h2 className="text-xl font-semibold text-white">
                                Total Orders
                            </h2>
                            <p className="text-3xl font-bold text-white">
                                {stats.totalOrders}
                            </p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-lg">
                            <h2 className="text-xl font-semibold text-white">
                                Total Products Sold
                            </h2>
                            <p className="text-3xl font-bold text-white">
                                {stats.totalProductsSold}
                            </p>
                        </div>
                    </Box>
                ) : (
                    <Typography
                        sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            color: "#111",
                        }}
                    >
                        No statistics available.
                    </Typography>
                )}
            </Box>
            <Box mb={3}>
                <Typography
                    variant="h6"
                    mb={2}
                    sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        color: "#111",
                    }}
                >
                    Product Ranking
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: "primary.main" }}>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: "white",
                                        fontFamily: "Montserrat, sans-serif",
                                        fontWeight: "bold",
                                    }}
                                    align="left"
                                >
                                    Product
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "white",
                                        fontFamily: "Montserrat, sans-serif",
                                        fontWeight: "bold",
                                    }}
                                    align="left"
                                >
                                    Sales
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: "white",
                                        fontFamily: "Montserrat, sans-serif",
                                        fontWeight: "bold",
                                    }}
                                    align="right"
                                >
                                    Percentage
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProductSales.map(([product, sales]) => (
                                <TableRow key={product}>
                                    <TableCell align="left">
                                        {product}
                                    </TableCell>
                                    <TableCell align="left">
                                        ₹{sales.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {((sales / totalSales) * 100).toFixed(
                                            2,
                                        )}
                                        %
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default SellerDashboard;
