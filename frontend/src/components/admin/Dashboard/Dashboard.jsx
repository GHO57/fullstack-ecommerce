import React, { useEffect, useState } from 'react';
import axios from 'axios';
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProducts: 0,
        totalSellers: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalPendingOrders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/v1/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
        window.scrollTo(0,0)
    }, []);


    return (
        <>
            <div className='min-h-[90vh] w-full px-[5rem] py-[3rem]'>

                <div className='w-full flex-center'>
                    <h1 className='font-extrabold text-[30px] text-mediumGray'>Admin Dashboard</h1>
                </div>
                <div className="admin-dashboard p-6  min-h-screen" >
                    {/* <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1> */}


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold  text-white ">Total Revenue</h2>
                            <p className="text-3xl font-bold text-white">₹{new Intl.NumberFormat('en-IN').format(stats.totalRevenue)}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Sellers</h2>
                            <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('en-IN').format(stats.totalSellers)}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Users</h2>
                            <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('en-IN').format(stats.totalUsers)}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Products</h2>
                            <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('en-IN').format(stats.totalProducts)}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Orders</h2>
                            <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('en-IN').format(stats.totalOrders)}</p>
                        </div>
                        <div className="stat bg-primary p-4 rounded-sm shadow-2xl border-r-4">
                            <h2 className="text-xl font-semibold text-white">Total Pending Orders </h2>
                            <p className="text-3xl font-bold text-white">{new Intl.NumberFormat('en-IN').format(stats.totalPendingOrders)}</p>
                        </div>

                    </div>

                </div>
            </div>

        </>
    );
};

export default Dashboard;
