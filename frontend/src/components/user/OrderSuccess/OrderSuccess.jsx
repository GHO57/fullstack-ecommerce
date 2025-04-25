import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getOrderItems } from "../../../features/user/userThunks";
import { Link, useParams } from "react-router-dom";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Loader } from "../../../layouts";

const OrderSuccess = () => {
    const dispatch = useDispatch();
    const { reference_id } = useParams();

    const { loading, orderItems, allOrders, deliveryAddress } = useSelector(
        (state) => state.user,
    );

    const [orderId, setOrderId] = useState("");
    const [total, setTotal] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [deliveryAddressId, setDeliveryAddressId] = useState("");
    const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState([]);

    const table_head_cell_properties = {
        color: "white",
        fontWeight: "bold",
        fontFamily: "Montserrat, sans-serif",
    };
    const table_body_cell_properties = {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 500,
        fontSize: 13,
    };
    const truncation_properties = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    useEffect(() => {
        if (deliveryAddressId !== "") {
            const address = deliveryAddress.find(
                (addr) => addr.id === deliveryAddressId,
            );
            setSelectedDeliveryAddress(address);
        }
    }, [deliveryAddressId]);

    useEffect(() => {
        if (orderItems.length === 0 && allOrders.length > 0) {
            const order_id = allOrders.find(
                (order) => order.payment_id === reference_id,
            );
            if (order_id !== undefined) {
                dispatch(getOrderItems(order_id.id));
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (orderItems.length > 0) {
            const order = allOrders.find(
                (order) => order.id === orderItems[0].order_id,
            );
            if (order) {
                setOrderId(order.id);
                setTotal(order.total);
                setPaymentStatus(order.payment_status);
                setPaymentMethod(order.payment_method);
                setOrderStatus(order.status);
                setDeliveryAddressId(order.delivery_address_id);
            }
        }
    }, [orderItems, allOrders]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : orderItems.length > 0 && allOrders.length > 0 ? (
                <div className="min-h-[90vh] w-full px-[5rem] py-[3rem] ">
                    <div className="flex flex-col gap-[2.5rem]">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-[1rem]">
                                <CheckCircleIcon
                                    sx={{ fontSize: "70px" }}
                                    color="success"
                                />
                                <h2 className="font-extrabold text-[35px]">
                                    Order Placed Successfully
                                </h2>
                            </span>
                            <Link to="/" className="btn rounded-[3px]">
                                Continue Shopping
                            </Link>
                        </div>
                        <div className="flex gap-[1rem]">
                            <div className="flex-[2] flex flex-col gap-[1rem]">
                                <div className="bg-white shadow-md rounded-[4px] pb-[1.5rem] flex flex-col gap-[0.5rem] border-[1px] border-lightGray3">
                                    <h2 className="font-bold text-[16px] bg-primary rounded-[4px_4px_0_0] text-white px-[1.5rem] py-[1rem] mb-[0.3rem]">
                                        Delivery Address
                                    </h2>
                                    <div className="flex flex-col px-[1.5rem]">
                                        <h3 className="font-bold text-[17px] mb-[0.2rem]">
                                            {selectedDeliveryAddress.fullname}
                                        </h3>
                                        <p className="text-[15px]">
                                            {selectedDeliveryAddress.address},{" "}
                                            {selectedDeliveryAddress.landmark}
                                        </p>
                                        <p className="text-[15px]">
                                            {selectedDeliveryAddress.city},{" "}
                                            {selectedDeliveryAddress.state},
                                            India,{" "}
                                            {selectedDeliveryAddress.pincode}
                                        </p>
                                        <div className="flex gap-[1rem]">
                                            <p className="text-[15px]">
                                                {
                                                    selectedDeliveryAddress.mobile_number
                                                }
                                            </p>
                                            <p className="text-[15px]">
                                                {
                                                    selectedDeliveryAddress.alternate_phone_number
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <TableContainer
                                    sx={{ boxShadow: 5 }}
                                    component={Paper}
                                >
                                    <Table
                                        sx={{ minWidth: 650 }}
                                        aria-label="order items table"
                                    >
                                        <TableHead>
                                            <TableRow
                                                sx={{ bgcolor: "#ff5151" }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        ...table_head_cell_properties,
                                                        minWidth: 150,
                                                        maxWidth: 150,
                                                    }}
                                                    align="left"
                                                >
                                                    Product
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        ...table_head_cell_properties,
                                                        minWidth: 150,
                                                        maxWidth: 150,
                                                    }}
                                                    align="left"
                                                >
                                                    Quantity
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        ...table_head_cell_properties,
                                                        minWidth: 150,
                                                        maxWidth: 150,
                                                    }}
                                                    align="left"
                                                >
                                                    Price
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        ...table_head_cell_properties,
                                                        minWidth: 150,
                                                        maxWidth: 150,
                                                    }}
                                                    align="left"
                                                >
                                                    MRP
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        ...table_head_cell_properties,
                                                        minWidth: 150,
                                                        maxWidth: 150,
                                                    }}
                                                    align="right"
                                                >
                                                    Status
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderItems
                                                .filter(
                                                    (order) =>
                                                        order.payment_status !==
                                                        null,
                                                )
                                                .map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell
                                                            sx={{
                                                                ...table_body_cell_properties,
                                                                truncation_properties,
                                                            }}
                                                            align="left"
                                                        >
                                                            <div className="flex items-center w-full gap-[0.5rem]">
                                                                <div className="max-w-[50px]">
                                                                    <img
                                                                        className="w-full h-full"
                                                                        src={
                                                                            item.image_url
                                                                        }
                                                                        alt={`${item.name} image`}
                                                                    />
                                                                </div>
                                                                <div className="overflow-hidden max-w-[350px]">
                                                                    <p className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                                                                        ID:{" "}
                                                                        {
                                                                            item.id
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                ...table_body_cell_properties,
                                                                minWidth: 150,
                                                                maxWidth: 150,
                                                            }}
                                                            align="left"
                                                        >
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                ...table_body_cell_properties,
                                                                minWidth: 150,
                                                                maxWidth: 150,
                                                            }}
                                                            align="left"
                                                        >
                                                            ₹
                                                            {new Intl.NumberFormat(
                                                                "en-IN",
                                                            ).format(
                                                                item.price,
                                                            )}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                ...table_body_cell_properties,
                                                                minWidth: 150,
                                                                maxWidth: 150,
                                                            }}
                                                            align="left"
                                                        >
                                                            ₹
                                                            {new Intl.NumberFormat(
                                                                "en-IN",
                                                            ).format(item.mrp)}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                ...table_body_cell_properties,
                                                                minWidth: 150,
                                                                maxWidth: 150,
                                                                color: "red",
                                                            }}
                                                            align="right"
                                                        >
                                                            {
                                                                item.product_status
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className="flex flex-[0.8]">
                                <div className="flex flex-col gap-[1.5rem] bg-white shadow-lg border-[1px] border-lightGray3 px-[1.5rem] py-[2rem] h-fit rounded-[3px] w-full">
                                    <h3 className="font-[Roboto] font-bold pb-[1.5rem] border-b-[1px] border-b-lightGray3">
                                        Price Details ({orderItems.length}{" "}
                                        items)
                                    </h3>
                                    <div className="flex flex-col gap-[1.5rem] border-b-[1px] border-b-lightGray3 pb-[1.5rem]">
                                        <span className="flex items-center justify-between">
                                            <h4 className="font-[Roboto] flex font-medium text-[16px]">
                                                Price:{" "}
                                            </h4>
                                            <p className="font-[Roboto] text-[16px]">
                                                ₹
                                                {new Intl.NumberFormat(
                                                    "en-IN",
                                                ).format(
                                                    total > 1000
                                                        ? total
                                                        : total - 100,
                                                )}
                                            </p>
                                        </span>
                                        <span className="flex items-center justify-between">
                                            <h4 className="font-[Roboto] flex font-medium text-[16px]">
                                                Delivery Charges:{" "}
                                            </h4>
                                            <p
                                                className={`font-[Roboto] text-[16px] ${total > 1000 ? "text-[green]" : ""}`}
                                            >
                                                {total > 1000
                                                    ? "Free"
                                                    : `₹${100}`}
                                            </p>
                                        </span>
                                        <span className="flex items-center justify-between">
                                            <h4 className="font-[Roboto] flex font-medium text-[16px]">
                                                Payment Status:{" "}
                                            </h4>
                                            <p
                                                className={`font-[Roboto] text-[16px] ${paymentStatus == "Completed" ? "text-[green]" : "text-[red]"}`}
                                            >
                                                {paymentStatus}
                                            </p>
                                        </span>
                                        <span className="flex items-center justify-between">
                                            <h4 className="font-[Roboto] flex font-medium text-[16px]">
                                                Payment Method:{" "}
                                            </h4>
                                            <p
                                                className={`font-[Roboto] text-[16px]`}
                                            >
                                                {paymentMethod}
                                            </p>
                                        </span>
                                        <span className="flex items-center justify-between">
                                            <h4 className="font-[Roboto] flex font-medium text-[16px]">
                                                Order Status:{" "}
                                            </h4>
                                            <p
                                                className={`font-[Roboto] text-[16px] ${orderStatus == "Delivered" ? "text-[green]" : "text-[red]"}`}
                                            >
                                                {orderStatus}
                                            </p>
                                        </span>
                                    </div>
                                    <span className="flex items-center justify-between">
                                        <h4 className="font-[Roboto] flex font-semibold text-[18px]">
                                            {paymentStatus == "Completed"
                                                ? "Total Paid: "
                                                : "Total Amount: "}{" "}
                                        </h4>
                                        <p className="font-[Roboto] text-[18px] font-medium">
                                            ₹
                                            {new Intl.NumberFormat(
                                                "en-IN",
                                            ).format(total)}
                                        </p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-center min-h-[80vh]">
                    <div className="flex-center gap-y-12 h-full flex-col shadow-xl max-w-[600px] px-12 py-14 w-full rounded-md border-[1px] border-mediumGray4">
                        <div className="flex flex-col items-center gap-[1rem]">
                            <CheckCircleIcon
                                sx={{ fontSize: "90px" }}
                                color="success"
                            />
                            <h2 className="font-extrabold text-[30px]">
                                Order Placed Successfully
                            </h2>
                            <p className="text-[14px] text-mediumGray3">
                                Thank your for ordering. Your order will be
                                confirmed soon.
                            </p>
                        </div>
                        <div className="flex justify-between w-full gap-[1rem]">
                            <Link
                                to="/orders"
                                className="bg-white h-12 flex-center text-secondary hover:bg-secondary duration-150 hover:text-white font-medium w-full rounded-[3px] border-[1px] border-secondary"
                            >
                                View Orders
                            </Link>
                            <Link
                                to="/"
                                className="bg-primary h-12 flex-center text-white hover:bg-secondary duration-150 font-medium w-full rounded-[3px]"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderSuccess;
