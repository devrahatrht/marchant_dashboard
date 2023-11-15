import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import ShopCard from './ShopCard';
import thanaData from './thana.json'

const Shop = () => {

    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [bannerImage, setBannerImage] = useState('');
    const [update, setUpdate] = useState('')
    const [action, setAction] = useState('')



    // create action

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const createShop = async (data) => {
        const { name, address, profileImage, bannerImage, division_id, district_id, thana } = data;
        console.log(name, address, profileImage[0], bannerImage[0], division_id, district_id)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("division_id", division_id);
        formData.append("district_id", district_id);
        formData.append("thana", thana);
        formData.append("profile_image", profileImage[0]);
        formData.append("banner_image", bannerImage[0]);

        // console.log(division)

        await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/shop`, {
            method: "POST",
            headers: {
                // 'content-type': "application/json",
                "authorization": `Bearer ${localStorage.getItem('token')}`,
                "X-Requested-With": "XMLHttpRequest",
            },
            body: formData
        }).then(res => res.json())
            .then(data => {
                if (data.success === true) {
                    toast.success("Successfully create a shop");
                    setAction(data)
                } else {
                    toast.error(data.message)
                    reset()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    // update shop


    const updateShop = async () => {

        // console.log(name, address, profileImage, bannerImage)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("profile_image", profileImage[0]);
        formData.append("banner_image", bannerImage[0]);


        await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/shop-update`, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
        }).then(res => res.json())
            .then(data => {
                if (data.success === true) {
                    toast.success("Successfully Updated")
                    setUpdate(data)
                    document.getElementById("edit-shop-details").click();
                } else {
                    toast.error(data.message)

                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    // Shop list & Shop Details fetch call

    const [list, setList] = useState()
    const [details, setDetails] = useState("")

    // shop list api call and get id
    const [division, setDivision] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/division`, {
            method: "GET",
            headers: {
                // "X-Requested-With": "XMLHttpRequest",
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                setDivision(data.data)
            })
    }, [])


    // console.log(division)

    const [district, setDistrict] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/district`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                setDistrict(data.data)
            })
    }, [])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/shop`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                setList(data)
            })
    }, [action, update])

    // console.log(list)

    const id = list?.data[0]?.id

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/shop/${id}`, {
            method: "GET",
            headers: {
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                setDetails(data)
            })
    }, [action, update, id])

    // console.log(list)
    // console.log(details)


    // shop details api call and get id

    return (
        <div className='ml-[90px] pr-5'>
            <div className="flex flex-col items-center justify-around bg-white h-24 p-2 drop-shadow-2xl">
                <div className="flex flex-row space-x-3">

                    <h4 className="font-bold text-gray-500 p-1">Dashboard / Shop</h4>

                </div>
                <p className="text-gray-400 p-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {date.toLocaleTimeString()}</p>
            </div>
            <div className="container mt-10 ">
                <div className='grid lg:grid-cols-2 w-full sm:grid-cols-1 gap-5'>
                    {/*Crate shop Form start */}
                    {!details && (
                        <div className="card lg:w-full sm:w-96 bg-base-100 shadow-2xl">
                            <div className="card-body">
                                <h2 className="text-center">Add Shop</h2>
                                {/* add categories form */}
                                <form onSubmit={handleSubmit(createShop)} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Shop Name</label>
                                        <input type="text" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" placeholder="shop name"
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: "Please give your shop name"
                                                },
                                            })}
                                        />

                                        <p className='text-left text-xs text-red-500'>{errors.name?.message}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Shop Address</label>

                                        <textarea type='text' placeholder="address here..." className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                            {...register("address", {
                                                required: {
                                                    value: true,
                                                    message: "shop name must be required"
                                                },
                                                minLength: {
                                                    value: 4,
                                                    message: "Must be exceed 4 characters"
                                                }
                                            })}
                                        />
                                        <p className='text-left text-xs text-red-500'>{errors.address?.message}</p>
                                    </div>
                                    <div className='flex w-full space-x-4'>
                                        <div className='w-full'>
                                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Division</label>
                                            <select {...register("division_id", {
                                                required: {
                                                    value: true,
                                                    message: "Please Select Division"
                                                },
                                            })} className=" bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5">
                                                <option disabled selected>Select Division</option>
                                                {division.map((list) =>
                                                    <option value={list.id}>{list.name}</option>
                                                )}
                                            </select>

                                            <p className='text-left text-xs text-red-500'>{errors.division?.message}</p>
                                        </div>
                                        <div className='w-full'>
                                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">District</label>
                                            <select {...register("district_id", {
                                                required: {
                                                    value: true,
                                                    message: "Please Select District"
                                                },
                                            })} className=" bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5">
                                                <option disabled selected>Select District</option>
                                                {district.map((list) =>
                                                    <option value={list.id}>{list.name}</option>
                                                )}
                                            </select>

                                            <p className='text-left text-xs text-red-500'>{errors.district?.message}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='w-full'>
                                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Area</label>
                                            <select {...register("thana", {
                                                required: {
                                                    value: true,
                                                    message: "Please Select District"
                                                },
                                            })} className=" bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5">
                                                <option disabled selected>Select Area</option>
                                                {thanaData.map((list) =>
                                                    <option className='' value={list.name}>{list.name}</option>
                                                )}
                                            </select>

                                            <p className='text-left text-xs text-red-500'>{errors.thana?.message}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="Profile" className="block mb-2 text-sm font-medium text-gray-900 text-left">Profile Image</label>

                                        <input type='file' className="file-input file-input-bordered rounded-lg file-input-sm w-full " required=""
                                            {...register("profileImage", {
                                                required: {
                                                    value: true,
                                                    message: "profile must be required"
                                                },
                                            })}
                                        />
                                        <p className='text-left text-xs text-red-500'>{errors.profileImage?.message}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="banner image" className="block mb-2 text-sm font-medium text-gray-900 text-left">Banner Image</label>

                                        <input type='file' className="file-input file-input-bordered rounded-lg file-input-sm w-full " required=""
                                            {...register("bannerImage", {
                                                required: {
                                                    value: true,
                                                    message: "banner image must be required"
                                                },
                                            })}
                                        />
                                        <p className='text-left text-xs text-red-500'>{errors.bannerImage?.message}</p>
                                    </div>

                                    <div className="card-actions justify-center">
                                        <button type="submit" className="btn w-full btn-primary">Create Shop</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}

                    {/* form end */}

                    {details ? (
                        <div className="card lg:w-full sm:w-96 bg-base-100 shadow-xl h-auto">
                            <div className="card-body">
                                <h2 className="card-title ">Shop List</h2>
                                <span className='text-left pl-3 font-semibold'>Shop Id: {list?.data[0]?.id}</span>
                                <span className='text-left pl-3 font-semibold'>Shop Name: {list?.data[0]?.name}</span>
                                <span className='text-left pl-3 font-semibold'>Shop Address: {list?.data[0]?.address} </span>
                                <div className="card-actions justify-end">

                                </div>
                            </div>
                        </div>
                    ) : (<h2 className='text-red-500 text-xl'>No Shop List</h2>)}

                    {/* merchant shop details */}


                    {/* <div className="card card-compact w-96 bg-base-100 shadow-xl">
                        <figure className='relative'><img src={details?.data?.banner[0]?.original_url} alt="banner" />
                            <div className="avatar absolute bottom-3 left-4">
                                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={details?.data?.profile?.original_url} alt="" />
                                </div>
                            </div>
                        </figure>

                        <div className="card-body">
                            <span className="card-title justify-between">
                                <span>{details?.data?.name}</span>
                                <span className='text-sm font-light'>Shop Id: {details?.data?.id}</span>
                            </span>
                            <p>Address: {details?.data?.address}</p>
                            <div className="card-actions justify-end">
                                <label htmlFor="edit-shop-details" className="btn btn-sm">Edit</label>
                            </div>
                        </div>
                    </div> */}

                    {details ? <ShopCard details={details}></ShopCard> : (<h2 className='text-red-500 text-xl'>No Add shop</h2>)}


                    {/* mainDetails end */}


                    {/* Modal section */}

                    <input type="checkbox" id="edit-shop-details" className="modal-toggle" />
                    <div className="modal mx-auto">
                        <div className="modal-box w-6/12 max-w-xl">



                            {/* add categories form */}

                            <form onSubmit={e => e.preventDefault()} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Shop Name:</label>
                                    <input type="text" onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" placeholder={details?.data?.name} />
                                </div>
                                <div>
                                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Shop Address</label>

                                    <textarea type='text' onChange={(e) => setAddress(e.target.value)} placeholder={details?.data?.address} className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required="" />

                                </div>
                                <div>
                                    <label htmlFor="Profile" className="block mb-2 text-sm font-medium text-gray-900 text-left">Profile Image</label>

                                    <input type='file' onChange={(e) => setProfileImage(e.target.files)} className="file-input file-input-bordered rounded-lg file-input-sm w-full " required="" />
                                </div>
                                <div>
                                    <label htmlFor="banner image" className="block mb-2 text-sm font-medium text-gray-900 text-left">Banner Image</label>

                                    <input type='file' onChange={(e) => setBannerImage(e.target.files)} className="file-input file-input-bordered rounded-lg file-input-sm w-full " required="" />
                                </div>

                                <div className="card-actions justify-center">
                                    <button onClick={updateShop} className="btn w-full btn-primary">update</button>
                                </div>

                            </form>
                            <div className="modal-action">
                                <label htmlFor="edit-shop-details" className="btn">close</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />


        </div>
    );
};

export default Shop;