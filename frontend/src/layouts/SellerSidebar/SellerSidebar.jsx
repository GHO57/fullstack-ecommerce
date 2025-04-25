import React, { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { AppBar, Button, IconButton, Toolbar, Tooltip, styled } from '@mui/material';
import { links } from './data'
import { Link, useLocation } from 'react-router-dom';
import { MdSpaceDashboard } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { SiGoogleforms } from "react-icons/si";
import { TfiPackage } from "react-icons/tfi";
import MuiAppBar from '@mui/material/AppBar';
import { sellerlogout } from '../../features/seller/sellerThunks';
import { useDispatch } from 'react-redux';

const drawerWidth = 240;

const CustomAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: 150,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - 250px)`,
      justifyContent: 'end',
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: 150,
      }),
    }),
  }));


const SellerSidebar = () => {
    
    const dispatch = useDispatch()
    const location = useLocation()
    const [toggleSidebar, setToggleSidebar] = useState(false)

    const iconMap = {
        MdSpaceDashboard: <MdSpaceDashboard />,
        FaTrash: <FaTrash />,
        SiGoogleforms: <SiGoogleforms />,
        TfiPackage: <TfiPackage />,
    };



    const handleSidebarEvent = () => {
        setToggleSidebar(prev => !prev)
    }

    const sellerLogout = () => {
        dispatch(sellerlogout())
      }

  return (
    <>
        {toggleSidebar && (
            <div className='bg-black w-full h-full absolute inset-0 z-[5999] opacity-60' onClick={() => setToggleSidebar(false)}></div>
        )}
        <CustomAppBar 
            position="fixed" 
            open={toggleSidebar} 
            sx={{ 
                zIndex: '6001', 
                bgcolor: 'white' ,
                boxShadow: toggleSidebar && 0,
            }}>
            <Toolbar sx={{ justifyContent: toggleSidebar ? 'end' : 'space-between' }}>
                <IconButton 
                    onClick={handleSidebarEvent}
                    edge='start' 
                    sx={{ 
                        color: '#555',
                        ...(toggleSidebar && { display: 'none' })
                        }}>
                        <MenuIcon />
                </IconButton>
                <Button onClick={sellerLogout} variant="contained" sx={{ borderRadius: '2px' }}>
                    Logout
                </Button>
            </Toolbar>
        </CustomAppBar>
        <div className={`fixed left-0 top-0 h-full bg-white transition-all duration-150 ${toggleSidebar ? 'w-[250px] max-w-[90%]' : 'w-[60px]'} z-[6000] py-[1rem] shadow-[3px_0_10px_rgba(0,0,0,0.3)]`}>
            <div className={`w-full h-full flex justify-between flex-col gap-[4rem]`}>
                <div className='w-full flex flex-col gap-[2rem]'>
                    <div className={` flex ${toggleSidebar ? 'justify-end pr-[0.5rem]' : 'justify-center'} pb-[1rem] w-full`}>
                        {toggleSidebar && (
                            <img className='w-full h-[40px] pl-[1.5rem]' src="/genie-logo.svg" alt="logo" />
                        )}
                        <IconButton onClick={handleSidebarEvent} sx={{ color: '#555' }}>
                            {!toggleSidebar ? (
                                <MenuIcon />
                            ):(
                                <CloseIcon />
                            )}
                        </IconButton>
                    </div>
                    <div className='flex flex-col'>
                        {links.map((link, index) => (
                            <Tooltip title={link.name} placement='right' arrow>
                                <Link onClick={() => setToggleSidebar(false)} to={`/seller/${link.path}`} className={`flex items-center gap-[1.5rem] p-[1.2rem] ${`/seller/${link.path}` === location.pathname && "bg-primary"}`}>
                                        <p className={`text-mediumGray2 text-[18px] ${`/seller/${link.path}` === location.pathname && " text-white"}`}>
                                            {iconMap[link.icon]}
                                        </p>
                                    <p className={`${toggleSidebar ? "visible" : "invisible"} text-[15px] overflow-hidden whitespace-nowrap text-mediumGray font-normal ${`/seller/${link.path}` === location.pathname && "text-white"}`} >{link.name}</p>
                                </Link>
                            </Tooltip>
                        ))}
                    </div>
                </div>
                <div className='flex-center'>
                    {!toggleSidebar ? (
                        <Link to="/" className={`${!toggleSidebar ? "visible" : "invisible"} text-mediumGray px-[1rem]`}>
                            <HomeIcon />
                        </Link>
                    ):(
                        <Link to="/" className={`${toggleSidebar ? "visible" : "invisible"} overflow-hidden whitespace-nowrap border-[1px] border-mediumGray bg-transparent text-mediumGray w-[80%] py-[0.6rem] px-[1rem] flex-center gap-[0.3rem] hover:bg-white hover:text-black duration-150 transition-colors`}>
                            <HomeIcon />
                            <p>
                                Go to Home
                            </p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </>
  )
}

export default SellerSidebar