import {
    Breadcrumbs,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../../layouts";
import { getOrderItems } from "../../../features/user/userThunks";
import { Link, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const OrderItems = () => {
    const dispatch = useDispatch();
    const { order_id } = useParams();

    const { loading, orderItems, allOrders, allDeliveryAddress } = useSelector(
        (state) => state.user,
    );

    const [totalPrice, setTotalPrice] = useState(0);
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
        if (orderItems.length > 0) {
            const order = allOrders.find(
                (order) => order.id === orderItems[0].order_id,
            );
            if (order) {
                setTotalPrice(order.total);
                setPaymentStatus(order.payment_status);
                setPaymentMethod(order.payment_method);
                setOrderStatus(order.status);
                setDeliveryAddressId(order.delivery_address_id);
            }
        }
    }, [orderItems, allOrders]);

    useEffect(() => {
        if (deliveryAddressId !== "") {
            const address = allDeliveryAddress.find(
                (addr) => addr.id === deliveryAddressId,
            );
            setSelectedDeliveryAddress(address);
        }
    }, [deliveryAddressId]);

    useEffect(() => {
        dispatch(getOrderItems(order_id));
    }, [dispatch, order_id]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="min-h-[90vh] w-full px-[5rem] py-[3rem] ">
                    <div className="flex flex-col gap-[2rem]">
                        <div className="w-full flex-center">
                            <div className="flex justify-start items-start max-w-[1380px] w-full">
                                <Breadcrumbs
                                    separator={
                                        <NavigateNextIcon fontSize="small" />
                                    }
                                    aria-label="breadcrumb"
                                >
                                    <Link
                                        to="/"
                                        className="hover:underline "
                                        color="inherit"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="hover:underline "
                                        color="inherit"
                                    >
                                        Orders
                                    </Link>
                                    <p className="text-primary ">{order_id}</p>
                                </Breadcrumbs>
                            </div>
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
                                                                <div className="overflow-hidden max-w-[300px]">
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
                                                                color:
                                                                    item.product_status ===
                                                                    "Pending"
                                                                        ? "red"
                                                                        : "green",
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
                                <div className="flex flex-col gap-[1.5rem] bg-white shadow-lg border-[1px] border-lightGray3 px-[1.5rem] py-[2rem] h-fit rounded-[4px] w-full">
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
                                                    totalPrice > 1100
                                                        ? totalPrice
                                                        : totalPrice - 100,
                                                )}
                                            </p>
                                        </span>
                                        <span className="flex items-center justify-between">
                                            <h4 className="font-[Roboto] flex font-medium text-[16px]">
                                                Delivery Charges:{" "}
                                            </h4>
                                            <p
                                                className={`font-[Roboto] text-[16px] ${totalPrice > 1100 ? "text-[green]" : ""}`}
                                            >
                                                {totalPrice > 1100
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
                                            ).format(totalPrice)}
                                        </p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderItems;
