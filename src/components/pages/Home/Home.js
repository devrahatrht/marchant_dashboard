import React, { useEffect, useState } from 'react';

const Home = () => {

    // profile details api fetch
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const [profile, setProfile] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant-details`, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => setProfile(data))
    }, [])


    return (
        <div className='ml-[90px] pr-5'>
            <div className="flex flex-col items-center justify-around bg-white h-24 p-2 drop-shadow-2xl">
                <div className="flex flex-row space-x-3">
                    <h4 className="font-bold text-gray-500 p-1">Welcome To Dashboard</h4>
                </div>
                <p className="text-gray-400 p-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {date.toLocaleTimeString()}</p>
            </div>
            <div className="grid lg:grid-cols-1 mt-10 w-full sm:grid-cols-3 gap-5 ">

                <div className="card lg:w-2/4 sm:w-96 bg-base-100 shadow-lg ">
                    <div className="card-body">
                        <h2 className="card-title ">Merchant Details</h2>
                        <span className='text-left pl-3 font-lg font-normal text-lg'>Merchant Name: <span className="font-[500] text-sm">{profile?.data?.name}</span></span>
                        <span className='text-left pl-3 font-lg font-normal text-lg'>Merchant Phone: <span className="font-[500] text-sm">{profile?.data?.phone}</span></span>
                        <span className='text-left pl-3 font-semibold text-lg'>Status: <span className="badge">{profile?.data?.status}</span>  </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;