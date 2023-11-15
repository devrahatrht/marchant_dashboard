import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

const AllOrders = () => {
    const [history, setHistory] = useState([]);
    // const [user, setUser] = useState({});

    const navigate = useNavigate();


 

    // const userId = user?.data

    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

   


    const { data, isLoading } = useQuery("history", () => fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/order`, {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            'content-type': "application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then((res) => res.json()
    )
    )

    useEffect(() => {
        setHistory(data?.data)
    }, [data])

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    // const filteredHistory = Array.isArray(history) ? history.filter(historyItem => user && userId?.id === historyItem?.user_id) : [];

    // console.log(filteredHistory)

    return (
        <div className='ml-[90px] pr-5'>
            <div className="flex flex-col items-center justify-around bg-white h-24 p-2 drop-shadow-2xl">
                <div className="flex flex-row space-x-3">

                    <h4 className="font-bold text-gray-500 p-1 ">Dashboard | All Orders</h4>

                </div>
                <p className="text-gray-400 p-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {date.toLocaleTimeString()}</p>
            </div>
            <div className='container'>
                <div className="overflow-x-auto mt-10 rounded-none pb-24">
                    <table className="table w-full rounded-none">

                        <thead>
                            <tr>
                                <th className='text-black bg-white rounded-none'>Order No:</th>
                                <th className='text-black bg-white rounded-none'>Date</th>
                                <th className='text-black bg-white rounded-none'>Ship to</th>
                                <th className='text-black bg-white rounded-none'>Status</th>
                                <th className='text-black bg-white rounded-none'>Total</th>
                                <th className='text-black bg-white rounded-none'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(history) ? history?.slice(0).reverse().map((historyItem) => (
                                <tr key={historyItem?.id}>
                                    <td>{historyItem?.id}</td>
                                    <td>{new Date(historyItem?.created_at).toLocaleDateString()}</td>
                                    <td>{historyItem?.shipping_address.split(" ").slice(-2).join("")}</td>
                                    <td>
                                        <span className="badge bg-[#FB767D] rounded-none border-none">{historyItem?.order_status}</span>
                                    </td>
                                    <td>
                                        <span className='text-[25px] font-bold'>৳</span>{historyItem?.total}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                navigate(`/order_details/${historyItem?.id}`);
                                                localStorage.setItem("id", historyItem?.id)

                                            }} className="btn btn-sm bg-primary rounded-none">View</button>
                                    </td>
                                </tr>
                            )): (isLoading)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllOrders;