import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { RiShoppingCartFill,  RiLogoutBoxRFill } from "react-icons/ri";
import { FaShopify, FaSlackHash,  } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { ImExit, ImHome } from "react-icons/im";
import { Link, useNavigate } from 'react-router-dom';
import control from '../../../assets/control.png';
import logo from '../../../assets/logo.png';
const Sidebar = () => {
    // side bar left right
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // log out Function

    const logOut = async () => {
        // const clear = localStorage.removeItem('token')
        await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/logout`, {
            method: "post",
            headers: {
                "content-type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "authorization": `Bearer ${localStorage.getItem("token")}`             
            },
            
        }).then(res =>res.json() )
        .then(data =>{
            if (data) {
                toast.success(data.message);
                localStorage.removeItem('token')
                navigate('/login')
            }
        })
        .then(err => {
            console.log(err)
        })
    }

    // menu items 

    const menus = [

        { title: "Home", src: <ImHome />, to: '/' },
        { title: "Add Shop", src: <FaShopify />,  to: '/shop' },
        { title: "Add Category", src: <FaSlackHash/>, to: '/add-category' },
        { title: "Product", src: <FaBox />, to: '/products' },
        { title: "All Orders", src: <RiShoppingCartFill />, to: '/all_orders' },
        // { title: "Message", src: <RiMessage2Line />, to: '/message' },
        // { title: "Files ", src: <RiFolder2Line />, gap: true, to: '/file' },
        // { title: "Setting", src: <RiSettings2Line />, to: '/setting' },
    ];



    return (
        <div className="fixed top-0 left-0 z-30">
            <div className={` ${open ? "w-72" : "w-20"} bg-[#F3F3F3] h-screen  shadow-2xl p-5 pt-8 relative duration-300 `}>
                <img src={control} alt='' className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full  ${!open && "rotate-180"}`} onClick={() => setOpen(!open)} />
                <div className="flex gap-x-4 items-center">
                    <img src={logo} alt='' className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} />
                    <Link className={`text-black origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`} >
                        Dashboard
                    </Link>
                </div>
                <ul className="pt-6">
                    {menus.map((menu, index) => (
                        <Link key={index} to={menu.to}>
                            <li className={`flex  rounded-md p-2 cursor-pointer hover:bg-[#0D0D0D] hover:text-gray-300 text-neutral text-sm items-center gap-x-4 ${menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"} `}>
                                <span className='text-2xl font-bold'>{menu.src}</span>
                                <span className={`${!open && "hidden"} origin-left duration-200`}>
                                    {menu.title}
                                </span>
                            </li>
                        </Link>


                    ))}
                    <Link onClick={logOut} className='origin-left text-left'>
                        <li className='flex rounded-md p-2 cursor-pointer hover:bg-[#0D0D0D] hover:text-gray-300 text-neutral text-sm items-center gap-x-4' >
                            <span className='text-2xl font-bold'><ImExit></ImExit></span>
                            <span className={`${!open && "hidden"} origin-left duration-200`}>
                                Logout
                            </span>
                        </li>
                    </Link>
                </ul>
            </div>
            <Toaster />
        </div>
    );
};

export default Sidebar;