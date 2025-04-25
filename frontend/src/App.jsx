import React, { Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, BrowserRouter as Router, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Layout components
import { Header, Footer, Loader } from "./layouts";
import NotFound from "./layouts/404/NotFound";
import SellerSidebar from "./layouts/SellerSidebar/SellerSidebar";
import AdminSidebar from "./layouts/AdminSidebar/AdminSidebar";

// Lazy-loaded User components
const Home = React.lazy(() => import("./components/user/Home/Home"));
const Account = React.lazy(() => import("./components/user/Account/Account"));
const Orders = React.lazy(() => import("./components/user/Orders/Orders"));
const Cart = React.lazy(() => import("./components/user/Cart/Cart"));
const Checkout = React.lazy(() => import("./components/user/Checkout/Checkout"));
const OrderItems = React.lazy(() => import("./components/user/OrderItems/OrderItems"));
const OrderSuccess = React.lazy(() => import("./components/user/OrderSuccess/OrderSuccess"));
const Products = React.lazy(() => import("./components/user/Products/Products"));
const ProductDetails = React.lazy(() => import("./components/user/ProductDetails/ProductDetails"));
const CategorizedProducts = React.lazy(() =>
    import("./components/user/CategorizedProducts/CategorizedProducts")
);
const Wishlist = React.lazy(() => import("./components/user/Wishlist/Wishlist"));

// Lazy-loaded Seller components
const SellerLogin = React.lazy(() => import("./components/seller/Login/SellerLogin"));
const Apply = React.lazy(() => import("./components/seller/Apply/Apply"));
const MainPage = React.lazy(() => import("./components/seller/Mainpage/MainPage"));
const SellerDashboard = React.lazy(() => import("./components/seller/Dashboard/SellerDashboard"));
const SellerProducts = React.lazy(() =>
    import("./components/seller/SellerProducts/SellerProducts")
);
const AddProduct = React.lazy(() => import("./components/seller/AddProduct/AddProduct"));
const DeletedProducts = React.lazy(() =>
    import("./components/seller/DeletedProducts/DeletedProducts")
);
const ManageOrdersSeller = React.lazy(() =>
    import("./components/seller/ManageOrdersSeller/ManageOrdersSeller")
);
const SellerOrderItems = React.lazy(() =>
    import("./components/seller/SellerOrderItems/SellerOrderItems")
);

// Lazy-loaded Admin components
const Login = React.lazy(() => import("./components/admin/Login/Login"));
const Dashboard = React.lazy(() => import("./components/admin/Dashboard/Dashboard"));
const ManageSellers = React.lazy(() => import("./components/admin/ManageSellers/ManageSellers"));
const ManageAdmins = React.lazy(() => import("./components/admin/ManageAdmins/ManageAdmins"));
const ManageUsers = React.lazy(() => import("./components/admin/ManageUsers/ManageUsers"));
const ManageOrders = React.lazy(() => import("./components/admin/ManageOrders/ManageOrders"));
const ManageSellerApplications = React.lazy(() =>
    import("./components/admin/ManageSellerApplications/ManageSellerApplications")
);

// Redux slices and thunks
import { getAllOrders, loaduser } from "./features/user/userThunks";
import { getSellerOrders, loadSeller } from "./features/seller/sellerThunks";
import { loadadminuser } from "./features/admin/adminThunks";
import { getAllProducts } from "./features/products/productsThunks";
import { loadCart } from "./features/cart/cartThunks";
import { loadWishlist } from "./features/wishlist/wishlistThunks";

import { clearUserError, clearUserMessage } from "./features/user/userSlice";
import { clearAdminError, clearAdminMessage } from "./features/admin/adminSlice";
import { clearSellerError, clearSellerMessage } from "./features/seller/sellerSlice";
import { clearCartError, clearCartMessage } from "./features/cart/cartSlice";
import { clearWishlistError, clearWishlistMessage } from "./features/wishlist/wishlistSlice";

// Utilities
import { getCookie } from "./utilities/CookieChecker";

// External libraries
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderFailure from "./components/user/OrderFailure/OrderFailure";

function AppContent() {
    const dispatch = useDispatch();
    const hasLoadedUser = useRef(false);

    const { loading, loadingLogin, isAuthenticated, allOrders, orderItems, message, error } =
        useSelector((state) => state.user);
    const { adminLoading, isAdminAuthenticated, adminMessage, adminError } = useSelector(
        (state) => state.admin
    );
    const { sellerLoading, isSellerAuthenticated, sellerMessage, sellerError } = useSelector(
        (state) => state.seller
    );
    const { cartLoading, cartMessage, cartError, totalItems, totalPrice, totalMRP } = useSelector(
        (state) => state.cart
    );
    const { wishlistLoading, wishlistMessage, wishlistError } = useSelector(
        (state) => state.wishlist
    );

    const location = useLocation();
    const showHeaderFooter =
        !location.pathname.startsWith("/seller") && !location.pathname.startsWith("/admin");

    const renderSidebar = () => {
        if (
            location.pathname.startsWith("/seller") &&
            location.pathname !== "/seller" &&
            location.pathname !== "/seller/login" &&
            isSellerAuthenticated
        ) {
            return <SellerSidebar />;
        }
        if (
            location.pathname.startsWith("/admin") &&
            location.pathname !== "/admin/login" &&
            isAdminAuthenticated
        ) {
            return <AdminSidebar />;
        }
        return null;
    };

    useEffect(() => {
        const page = 1;
        const limit = 10;

        //conditionally dispatches the loading thunks and renders the message and errors
        if (!hasLoadedUser.current) {
            dispatch(loaduser());
            dispatch(loadCart());
            dispatch(getAllOrders());
            dispatch(loadWishlist());
            dispatch(loadadminuser());
            dispatch(loadSeller());
            dispatch(getSellerOrders());
            dispatch(getAllProducts({ page, limit }));
            hasLoadedUser.current = true;
        }

        if (
            (!loadingLogin && message) ||
            (!loading && message) ||
            (!adminLoading && adminMessage) ||
            (!sellerLoading && sellerMessage) ||
            (!cartLoading && cartMessage) ||
            (!wishlistLoading && wishlistMessage)
        ) {
            toast.dismiss();
            toast.success(
                adminMessage || sellerMessage || message || cartMessage || wishlistMessage
            );

            if (message) dispatch(clearUserMessage());
            if (adminMessage) dispatch(clearAdminMessage());
            if (sellerMessage) dispatch(clearSellerMessage());
            if (cartMessage) dispatch(clearCartMessage());
            if (wishlistMessage) dispatch(clearWishlistMessage());
        } else if (
            (!loadingLogin && error) ||
            (!loading && error) ||
            (!adminLoading && adminError) ||
            (sellerError && !sellerLoading) ||
            (!cartLoading && cartError) ||
            (!wishlistLoading && wishlistError)
        ) {
            if (adminError) {
                toast.dismiss();
                toast.error(adminError.message);
                dispatch(clearAdminError());
            } else if (sellerError) {
                toast.dismiss();
                toast.error(sellerError.message);
                dispatch(clearSellerError());
            } else if (cartError) {
                toast.dismiss();
                toast.error(cartError.message);
                dispatch(clearCartError());
            } else if (error) {
                toast.dismiss();
                toast.error(error.message);
                dispatch(clearUserError());
            } else if (wishlistError) {
                toast.dismiss();
                toast.error(wishlistError.message || wishlistError);
                dispatch(clearWishlistError());
            }
        }
    }, [
        dispatch,
        loading,
        adminLoading,
        loadingLogin,
        message,
        adminMessage,
        error,
        adminError,
        sellerLoading,
        sellerMessage,
        sellerError,
        cartLoading,
        cartMessage,
        cartError,
        wishlistLoading,
        wishlistMessage,
        wishlistError,
    ]);

    return (
        <>
            <ToastContainer
                className={`z-[20000]`}
                position="bottom-center"
                autoClose={4000}
                hideProgressBar={true}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                transition={Slide}
                stacked
                limit={1}
                theme="dark"
            />
            {renderSidebar()}

            {showHeaderFooter && (
                <div
                    className={`z-[5000] fixed top-0 left-0 right-0 shadow-[0_3px_16px_-4px_rgba(0,0,0,0.1)] bg-white`}
                >
                    <Header />
                </div>
            )}
            <div className={showHeaderFooter ? "mt-[87px]" : "mt-[47px]"}>
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route
                            exact
                            path="/account"
                            element={isAuthenticated ? <Account /> : <NotFound />}
                        />
                        <Route exact path="/products" element={<Products />} />
                        <Route exact path="/products/:search_term" element={<Products />} />
                        <Route exact path="/category/:category" element={<CategorizedProducts />} />
                        <Route exact path="/product/:product_id" element={<ProductDetails />} />
                        <Route
                            exact
                            path="/orders"
                            element={isAuthenticated ? <Orders /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/order/items/:order_id"
                            element={isAuthenticated ? <OrderItems /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/wishlist"
                            element={isAuthenticated ? <Wishlist /> : <NotFound />}
                        />
                        <Route exact path="/cart" element={<Cart />} />
                        <Route
                            exact
                            path="/checkout"
                            element={
                                isAuthenticated && totalItems > 0 ? <Checkout /> : <NotFound />
                            }
                        />
                        <Route
                            exact
                            path="/checkout/success/:reference_id"
                            element={isAuthenticated ? <OrderSuccess /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/checkout/failure"
                            element={isAuthenticated ? <OrderFailure /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/checkout/failure/:order_id"
                            element={isAuthenticated ? <OrderFailure /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/admin/login"
                            element={
                                isAdminAuthenticated ? (
                                    <Navigate to="/admin/dashboard" />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/admin/dashboard"
                            element={isAdminAuthenticated ? <Dashboard /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/admin/dashboard/sellers"
                            element={isAdminAuthenticated ? <ManageSellers /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/admin/dashboard/seller/applications"
                            element={
                                isAdminAuthenticated ? <ManageSellerApplications /> : <NotFound />
                            }
                        />
                        <Route
                            exact
                            path="/admin/dashboard/admins"
                            element={isAdminAuthenticated ? <ManageAdmins /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/admin/dashboard/users"
                            element={isAdminAuthenticated ? <ManageUsers /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/admin/dashboard/orders"
                            element={isAdminAuthenticated ? <ManageOrders /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/seller"
                            element={
                                isSellerAuthenticated ? (
                                    <Navigate to="/seller/dashboard" />
                                ) : (
                                    <MainPage />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/seller/apply"
                            element={
                                isSellerAuthenticated ? (
                                    <Navigate to="/seller/dashboard" />
                                ) : (
                                    <Apply />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/seller/login"
                            element={
                                isSellerAuthenticated ? (
                                    <Navigate to="/seller/dashboard" />
                                ) : (
                                    <SellerLogin />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/seller/dashboard"
                            element={
                                isSellerAuthenticated ? <SellerDashboard /> : <Navigate to="/" />
                            }
                        />
                        <Route
                            exact
                            path="/seller/dashboard/products"
                            element={isSellerAuthenticated ? <SellerProducts /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/seller/dashboard/orders"
                            element={isSellerAuthenticated ? <ManageOrdersSeller /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/seller/dashboard/order/items/:order_id"
                            element={isSellerAuthenticated ? <SellerOrderItems /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/seller/dashboard/products/add"
                            element={isSellerAuthenticated ? <AddProduct /> : <NotFound />}
                        />
                        <Route
                            exact
                            path="/seller/dashboard/products/deleted"
                            element={isSellerAuthenticated ? <DeletedProducts /> : <NotFound />}
                        />
                        <Route exact path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
            {showHeaderFooter && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
