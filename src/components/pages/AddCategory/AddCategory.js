import React, { useEffect, useState } from 'react';


const AddCategory = () => {
    const [lists, setLists] = useState({});
    // const [depend, setDepend] = useState({});
    // const [category, setCategory] = useState();
    // const [details, setDetails] = useState([]);
    // Create category 
    // const { register, handleSubmit, formState: { errors }, } = useForm();

    // handle create category button


    // category List
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/category`, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                // console.log(data.data)
                setLists(data)
                // setDetails(data?.data)
            })
    }, [])

    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const allLists = lists?.data;
    // console.log(allLists)

    return (
        <div className='ml-[90px] pr-5'>
            <div className="flex flex-col items-center justify-around bg-white h-24 p-2 drop-shadow-2xl">
                <div className="flex flex-row space-x-3">
                    <h4 className="font-bold text-gray-500 p-1">Dashboard | Category List</h4>
                </div>
                <p className="text-gray-400 p-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {date.toLocaleTimeString()}</p>
            </div>
            <div className="container">
                <div className='grid lg:grid-cols-2 w-full sm:grid-cols-3 gap-5'>
                    {/* categories details */}
                </div>
                {/* {allLists.length} */}
                <div>
                    {allLists &&
                        <div className=' grid sm:grid-cols-1 lg:grid-cols-4 gap-5 mt-10 '>
                            {allLists.map((allList, index) => (
                                <div className="card mt-5 w-auto bg-base-100 shadow-xl">

                                    <div key={index} className="card-body">
                                        <div className="flex justify-between items-center">
                                            <span className='font-semibold text-2xl sm:text-xl'>{allList?.name}</span>
                                            <span className='text-sm'>shop id: {allList?.shop_id}</span>
                                        </div>
                                        <p className='text-left text-sm'>Address: {allList?.shop?.address}</p>

                                        <span className='text-left pl-5'>Category Name: {allList?.name}</span>
                                        <span className='text-left pl-5'>Category Id: {allList?.id}</span>
                                        <span className='text-left pl-5'>Status:  <span className="badge badge-sm p-2">{allList?.status}</span></span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default AddCategory;