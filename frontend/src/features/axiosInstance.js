import axios from 'axios'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const axiosInstance = axios.create({
    // baseURL: '/api/v1',
    timeout: 30000
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === "ECONNABORTED") {
            toast.error("Something went wrong!");
        }

        return Promise.reject(error)
    }
)


export default axiosInstance