import { useEffect, useRef, useState } from 'react'
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate
} from 'react-router-dom'
import { Header, Footer } from './layouts'
import { Home, Account } from './components'
import Orders from './components/user/Orders/Orders'
import { Login, Dashboard, ManageSellers, ManageAdmins, ManageUsers, ManageOrders, ManageSellerApplications } from './components/admin'
import { SellerLogin, Apply, MainPage, SellerDashboard, SellerProducts, AddProduct, DeletedProducts } from './components/seller'
import { getAllOrders, loaduser } from './features/user/userThunks'
import { loadSeller } from './features/seller/sellerThunks'
import { loadadminuser } from './features/admin/adminThunks'
import { getAllProducts } from './features/products/productsThunks'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './layouts/404/NotFound'
import Cart from './components/user/Cart/Cart'
import { loadCart } from './features/cart/cartThunks'
import Checkout from './components/user/Checkout/Checkout'
import OrderItems from './components/user/OrderItems/OrderItems'
import OrderSuccess from './components/user/OrderSuccess/OrderSuccess'

function App() {

  const dispatch = useDispatch()
  const hasLoadedUser = useRef(false)

  const { loading, loadingLogin, isAuthenticated, allOrders, orderItems, message, error } = useSelector((state) => state.user)
  const { adminLoading, isAdminAuthenticated, adminMessage, adminError  } = useSelector((state) => state.admin)
  const { sellerLoading, isSellerAuthenticated, sellerMessage, sellerError } = useSelector((state) => state.seller)
  const { cartLoading, cartMessage, cartError, totalItems, totalPrice, totalMRP } = useSelector((state) => state.cart)

  useEffect(() => {
    
    if(!hasLoadedUser.current){
      dispatch(loaduser())
      dispatch(loadadminuser())
      dispatch(loadSeller())
      dispatch(getAllProducts())
      dispatch(loadCart())
      dispatch(getAllOrders())
      hasLoadedUser.current = true
    }

    if((!loadingLogin && message) || (!loading && message) || (!adminLoading && adminMessage) || (!sellerLoading && sellerMessage)){
      toast.success(adminMessage || sellerMessage || message);
    }else if((!loadingLogin && error) || (!loading && error) || (!adminLoading && adminError) || (sellerError && !sellerLoading)){
      if(adminError){
        toast.error(adminError.message)
      }else if(sellerError){
        toast.error(sellerError.message)
      }else{
        toast.error(error.message)
      }
    }

  }, [dispatch, loading, adminLoading, loadingLogin, message, adminMessage, error, adminError, sellerLoading, sellerMessage, sellerError])

  return (
    <Router>
      <ToastContainer 
            position='bottom-center'
            autoClose={4000}
            hideProgressBar={true}
            pauseOnHover={false}
            pauseOnFocusLoss={false}
            transition={Slide}
            stacked
            limit={1}
            theme='dark'
        />
      <div className={`z-[5000] fixed top-0 left-0 right-0 shadow-[0_3px_16px_-4px_rgba(0,0,0,0.1)] bg-white`}>
        <Header />
      </div>
      <div className='mt-[87px]'>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/account' element={isAuthenticated ? <Account /> : <NotFound />} />
          <Route exact path='/orders' element={isAuthenticated ? <Orders /> : <NotFound />} />
          <Route exact path='/order/items/:order_id' element={isAuthenticated ? <OrderItems /> : <NotFound />} />
          <Route exact path='/cart' element={<Cart />} />
          <Route exact path='/checkout' element={isAuthenticated && totalItems > 0 ? <Checkout /> : <NotFound />} />
          <Route exact path='/checkout/success/:reference_id' element={isAuthenticated ? <OrderSuccess /> : <NotFound />} />
          <Route exact path='/admin/login' element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" /> : <Login />} />
          <Route exact path='/admin/dashboard' element={isAdminAuthenticated ? <Dashboard /> : <NotFound />} />
          <Route exact path='/admin/dashboard/sellers' element={isAdminAuthenticated ? <ManageSellers /> : <NotFound />} />
          <Route exact path='/admin/dashboard/seller/applications' element={isAdminAuthenticated ? <ManageSellerApplications /> : <NotFound />} />
          <Route exact path='/admin/dashboard/admins' element={isAdminAuthenticated ? <ManageAdmins /> : <NotFound />} />
          <Route exact path='/admin/dashboard/users' element={isAdminAuthenticated ? <ManageUsers /> : <NotFound />} />
          <Route exact path='/admin/dashboard/orders' element={isAdminAuthenticated ? <ManageOrders /> : <NotFound />} />
          <Route exact path='/seller' element={isSellerAuthenticated ? <Navigate to="/seller/dashboard"  />: <MainPage /> } />
          <Route exact path='/seller/apply' element={isSellerAuthenticated ? <Navigate to="/seller/dashboard" /> : <Apply /> } />
          <Route exact path='/seller/login' element={isSellerAuthenticated ? <Navigate to="/seller/dashboard" /> : <SellerLogin /> }/>
          <Route exact path='/seller/dashboard' element={isSellerAuthenticated ? <SellerDashboard /> : <Navigate to="/" /> }/>
          <Route exact path='/seller/dashboard/products' element={isSellerAuthenticated ? <SellerProducts /> : <NotFound />} />
          <Route exact path='/seller/dashboard/products/add' element={isSellerAuthenticated ? <AddProduct /> : <NotFound />} />
          <Route exact path='/seller/dashboard/products/deleted' element={isSellerAuthenticated ? <DeletedProducts /> : <NotFound />} />
          <Route exact path='*' element={<NotFound />} />
        </Routes>
      </div>
      <div>
        <Footer/>
      </div>
    </Router>
  )
}

export default App
