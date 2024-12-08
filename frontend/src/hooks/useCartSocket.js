import { useEffect } from "react";
import { io } from 'socket.io-client'
import { useDispatch } from "react-redux";
import { updateCartStock } from "../features/cart/cartThunks";


const useCartSocket = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const socket = io("http://localhost:4000")

        socket.emit("join_cart")

        socket.on('inventory_update', (data) => {

            const updates = JSON.parse(data)

            dispatch(updateCartStock(updates));
            // dispatch(updateProductStock({product_id: product_id, product_quantity: quantity}))
        })

        return () => {
            socket.emit("leave_cart")
            socket.disconnect()
        }
    },[dispatch])

    return null;
}



export default useCartSocket