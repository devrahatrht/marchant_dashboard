import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { RiMapPinLine } from "react-icons/ri";
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import getProductData from '../../getProductData/getProductData'
import { toast, Toaster } from 'react-hot-toast';


const OrderDetails = () => {
    const componentRef = useRef();
    const [history, setHistory] = useState([]);
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);



    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "invoice-data",
        onAfterPrint: () => toast("successfully Printed")
    })
    // console.log(props.id)
    const { data, isLoading } = useQuery("history", () => getProductData())

    useEffect(() => {
        setHistory(data?.data)
    }, [data])

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    const details = data?.data
    // console.log(details)

    // console.log(details)






    return (
        <div className='ml-[90px] pr-5'>
            <h1 className='text-center font-bold lg:text-4xl sm:text-2xl pb-8'>Order Details</h1>
            <div className="container" ref={componentRef}>
                <div className='lg:px-4 py-8 bg-white'>
                    <div className="header flex items-center justify-between">
                        <div className='text-left'>
                            <h2 className='text-2xl font-[500]'>Order No <span className='text-blue-400'>{details?.id}</span></h2>
                            <p className='italic text-left text-sm'>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <div className="badge badge-md text-left text-xs rounded-none border-none bg-[#F8951B]">Processing</div>
                        </div>
                        <div>
                            <p className='text-sm font-[600] text-black'>Shipped To</p>
                            <span className='flex items-center text-xs italic text-primary'>
                                <RiMapPinLine />
                                {details && details?.shipping_address && details.shipping_address.split('"').join('')}
                            </span>
                        </div>
                    </div>
                    {/* divider */}
                    <div className="divider"></div>

                    <div className='flex justify-between'>
                        <div>
                            {/* <span>Supplier Name</span>
                            <address>
                                Mrs. Name Info
                            </address> */}
                        </div>
                        <div className='text-right'>
                            <p className='p-2 bg-slate-300 cursor-pointer text-sm text-center font-bold'>Payment</p>
                            <p><span className='font-bold text-sm'>Invoice No:</span> {details.id}</p>
                            <p>  <span className='font-bold text-sm'>Order Date:</span> {new Date(details?.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            <p>  <span className='font-bold text-sm'>Payment By:</span> cash on delivery</p>
                        </div>

                    </div>
                    {/* divider end */}
                    <div className='grid sm:grid-cols-1 lg:grid-cols-1 pt-10 gap-4'>
                        {/* first part */}
                        <div className="overflow-x-auto w-full rounded-none">
                            <table className="table  w-full rounded-none">
                                <thead className=''>
                                    <tr className=''>
                                        <th className='bg-white text-black rounded-none'>Date</th>
                                        <th className='bg-white text-black rounded-none'>Products</th>
                                        <th className='bg-white text-black rounded-none'>Price</th>
                                        <th className='bg-white text-black rounded-none'>Qty</th>
                                        <th className='bg-white text-black rounded-none'>SubTotal</th>
                                        <th className='bg-white text-black rounded-none'>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='rounded-none'>

                                    {details ? (
                                        !Array.isArray(details) && details.order_items ? details.order_items.map((item, index) => (
                                            <tr key={index} className='border-none'>
                                                <td>{new Date(history?.created_at).toLocaleDateString()}</td>
                                                <td className='border-none'>
                                                    <div className="flex items-center space-x-3">
                                                        <div>
                                                            <div className="font-bold">{item.name}</div>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='border-none'>
                                                    <span className='text-[25px] font-bold'>৳</span>{item.price}
                                                </td>
                                                <td className='border-none'>
                                                    {item.quantity}
                                                </td>
                                                <td className='border-none'>
                                                    <span className='text-[25px] font-bold'>৳</span>{item.quantity * item.price}
                                                </td>
                                                <td className='border-none'>
                                                    <div className="badge badge-sx rounded-none bg-[#4f40d6] text-white">{details.order_status}</div>
                                                </td>

                                            </tr>
                                        )) : (isLoading)) : (<h4 className='text-xl text-red-500'>Sorry No Data Found</h4>)}

                                </tbody>
                            </table>
                        </div>
                        {/* first part end*/}
                        {/* 2nd  part start*/}
                        <div className="card mx-auto lg:w-full sm:w-full  bg-base-100 rounded-none mb-20">
                            <div className="card-body">
                                <div className='shadow-md p-5'>
                                    <p className='font-[500] text-normal'> Have a coupon? <Link className='link text-blue-500' to='/'>Click Here to enter your code</Link></p>
                                </div>
                                <div className="divider"></div>

                                {/* content */}
                                <div className='divide-y divide-slate-200'>
                                    <div className="flex items-center py-4 justify-between">
                                        <p>Shipping:</p>
                                        <p><span className='text-[25px] font-bold'>৳</span>{details?.shipping_charge}.00</p>
                                    </div>
                                    <div className="flex items-center py-4 justify-between">
                                        <p>Sub Total</p>
                                        <p><span className='text-[25px] font-bold'>৳</span>{details?.total}.00</p>
                                    </div>
                                    <div className="flex items-center py-4 justify-between">
                                        <p>Shipping Status</p>
                                        <p className='text-red-500 italic'>{details?.shipping_status}</p>
                                    </div>
                                    <div className="flex items-center py-4 justify-between">
                                        <p className='font-bold'>Paid Total</p>
                                        <p className='font-bold'><span className='text-[15px] font-[800]'>৳</span> {details?.total}</p>
                                    </div>
                                </div>


                                <div className="text-right ">
                                    <button onClick={handlePrint} className="text-end btn btn-md btn-primary bg-gradient-to-l from-primary to-[#52a3eb] hover:from-[#52a3eb] hover:to-primary ease-in-out delay-150 duration-300 transition rounded-none border-none">Print Invoice</button>
                                </div>

                            </div>

                        </div>

                        {/* 2nd  part end*/}
                    </div>
                </div>
            </div>
            <Toaster />
            {/* <button onClick={handlePrint} className='btn btn-success p-5 text-white'>Print Invoice / Download</button> */}

        </div>
    );
};

export default OrderDetails;