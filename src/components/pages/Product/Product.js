import React, { useEffect, useState } from 'react';
import { RiCloseFill } from "react-icons/ri";
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import ImageCropper from './ImageCropper';
import FileInput from './FileInput';


const Product = () => {

    // =================Image Crop function ===================

    function dataURLtoFile(dataURL, fileName) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, { type: mime });
    }
    const [image, setImage] = useState("");
    const [currentPage, setCurrentPage] = useState("choose-img");
    const [imgAfterCrop, setImgAfterCrop] = useState("");

    // Invoked when new image file is selected
    const onImageSelected = (selectedImg) => {
        setImage(selectedImg);
        setCurrentPage("crop-img");
    };

    // Generating Cropped Image When Done Button Clicked
    const onCropDone = (imgCroppedArea) => {
        const canvasEle = document.createElement("canvas");
        canvasEle.width = imgCroppedArea.width;
        canvasEle.height = imgCroppedArea.height;

        const context = canvasEle.getContext("2d");

        let imageObj1 = new Image();
        imageObj1.src = image;
        imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            const dataURL = canvasEle.toDataURL("image/jpeg");

            setImgAfterCrop(dataURL);
            setCurrentPage("img-cropped");
        };
    };

    // Handle Cancel Button Click
    const onCropCancel = () => {
        setCurrentPage("choose-img");
        setImage("");
    };
    // =================Image Crop function ===================
    const [product, setProduct] = useState({});
    const [showDetails, setShowDetails] = useState({});
    const [listproducts, setListPorducts] = useState([]);
    const [productId, setProductId] = useState('');
    const [shopId, setShopId] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productname, setProductname] = useState('');
    const [productDetails, setProductDetails] = useState('');
    const [shortDetails, setShortDetails] = useState('');
    const [stock, setStock] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    // const [details, setDetails] = useState();
    const [edit, setEdit] = useState('')


    // create Product form control
    const [lists, setLists] = useState([]);
    const [shopLists, setShopLists] = useState([]);
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
                setLists(data.data)
                // setDetails(data?.data)
            })
    }, [])
    // console.log(lists)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/shop`, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                // console.log(data.data)
                setShopLists(data.data)
                // setDetails(data?.data)
            })
    }, [])

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const createProduct = async (data) => {
        const { name, category, price, offerPrice, status, galleryImage, mainImage, weight, shop, stock, description_srt, description } = data;
        console.log(galleryImage)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category_id", category);
        formData.append("price", price);
        formData.append("offer_price", offerPrice);
        formData.append("status", status);
        formData.append("weight", weight);
        formData.append("shop_id", shop);
        formData.append("stock", stock);
        formData.append("long_description", description);
        formData.append("short_description", description_srt);
        const mainImageFile = mainImage[0]; // Get the selected file
        if (mainImageFile && mainImageFile.size > 4 * 1024 * 1024) {
            toast.error("Image size must be less than 4MB.");
            return; // Exit the function to prevent further execution
        }
        formData.append("main_image", mainImageFile);

        // const galleryImageFile = galleryImage[0]; // Get the selected file
        // if (galleryImageFile && galleryImageFile.size > 4 * 1024 * 1024) {
        //     toast.error("Image size must be less than 4MB");
        //     return; // Exit the function to prevent further execution
        // }
        // formData.append("gallery_image", galleryImageFile);

        if (imgAfterCrop) {
            const croppedImageFile = dataURLtoFile(imgAfterCrop, 'cropped_image.jpg');
            formData.append("gallery_image", croppedImageFile);
        }
        //  else {
        //     formData.append("gallery_image", galleryImageFile);
        // }

        // formData.append("main_image", mainImage[0]);
        // for (let i = 0; i < galleryImage.length; i++) {
        //     formData.append("gallery_image", galleryImage[i]);
        //     console.log(galleryImage[1])
        // }

        // api fetching

        await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/product`, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                // 'content-type': "application/json",
                "authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        }).then(res => res.json())
            .then(data => {
                if (data.success === true) {
                    toast.success("Successfully create a product");
                    setProduct(data)
                    document.getElementById("adding-product").click();
                    console.log(data);
                    setImgAfterCrop(null);
                    reset();
                } else {
                    toast.error(data.message)
                    // console.log(data)
                    // reset()
                }
            })
            .catch(err => {
                console.log(err)
            })
        
        // fetch api ending
    }


    // create Product form control and fetching api end

    // Product list details api fetching 

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/product`, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                setListPorducts(data?.data)
                // console.log(data.data)
            })
    }, [product, edit])

    // details

    const showDetailsModel = async (id) => {

        await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/product/${id}`, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                'content-type': "application/json",
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                setShowDetails(data)
            })
    }

    // console.log(showDetails?.data)


    // console.log(updatedProduct)
    const updateProduct = async () => {

        const formData = new FormData();
        formData.append("product_id", productId)
        formData.append("shop_id", shopId)
        formData.append("name", productname)
        formData.append("price", productPrice)
        formData.append("long_description", productDetails)
        formData.append("short_description", shortDetails)
        formData.append("stock", stock)
        formData.append("offer_price", offerPrice)
        await fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant/product-update`, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "authorization": `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        }).then(res => res.json())
            .then(data => {
                if (data.success === true) {
                    console.log("updated:", data)
                    toast.success("Successfully Updated");
                    setEdit(data)
                    reset()
                } else {
                    toast.error(data.message)
                    // reset()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    return (
        <div className=''>
            <div className="flex flex-col items-center justify-around bg-white h-24 p-2 drop-shadow-2xl">
                <div className="flex flex-row space-x-3">
                    <h4 className="font-bold text-gray-500 p-1 ">Dashboard | Add Product</h4>
                </div>
                <p className="text-gray-400 p-1">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {date.toLocaleTimeString()}</p>
            </div>

            {/* Responsive left control */}

            <div className='ml-[90px] pr-5'>
                <div className='container'>

                    {/* grid system*/}

                    <div className=" mt-8 grid lg:grid-cols-3 sm:grid-cols-2 gap-10 ">
                        <div className="card mt-5 w-auto cursor-pointer bg-base-100 shadow-xl">
                            <div className="flex items-center justify-between p-5">
                                <div>
                                    <div className="text-sm text-gray-400 text-left">Adding a product</div>
                                    <div className="flex items-center pt-1">
                                        <div className="text-3xl font-medium text-gray-600 ">Add Product</div>
                                    </div>
                                </div>
                                <div className="text-blue-500">
                                    <svg className='h-10 w-10' viewBox="0 0 20 20" fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="4.8"> <path opacity="0.4" d="M6 12H18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 18V6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M6 12H18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 18V6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                </div>
                            </div>
                            <label htmlFor="adding-product" className="btn">Add Product</label>
                        </div>

                        <div className="card mt-5 w-auto bg-base-100 shadow-xl">
                            <div className="flex items-center justify-between p-5">
                                <div>
                                    <div className="text-sm text-gray-400 text-left">Edit Product</div>
                                    <div className="flex items-center pt-1">
                                        <div className="text-3xl font-medium text-gray-600 ">Edit Product</div>
                                    </div>
                                </div>
                                <div className="text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <label htmlFor="product_update_modal" className="btn">Edit</label>
                        </div>

                        <div className="card mt-5 w-auto bg-base-100 shadow-xl">
                            <div className="flex items-center justify-between p-5">
                                <div>
                                    <div className="text-sm text-gray-400 ">Total Products</div>
                                    <div className="flex items-center pt-1">
                                        <div className="text-3xl font-medium text-gray-600 ">{listproducts?.length}</div>
                                    </div>
                                </div>
                                <div className="text-pink-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Grid End point */}


                    {/* product lists */}

                    {listproducts &&
                        <div className='container grid sm:grid-cols-1 lg:grid-cols-4 gap-5 mt-10 '>


                            {listproducts.map((allList, index) => (
                                <div class="bg-white rounded-md shadow-md p-4">
                                    <div class="text-xl font-bold">{allList?.name}</div>
                                    <div class="mt-4">
                                        <table class="table-auto w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="border px-4 py-2 font-bold text-right">Price</td>
                                                    <td className="border px-4 py-2 text-green-500 text-lg font-semibold">{allList?.offer_price === null ? "" : allList?.price}</td>
                                                    <td className="border px-4 py-2 text-lg">{!allList?.offer_price ? allList?.price : ""}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border px-4 py-2 font-bold text-right">Shop Name</td>
                                                    <td colSpan="2" class="border px-4 py-2 text-md text-gray-500">{allList?.shop?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border px-4 py-2 font-bold text-right">Shop ID</td>
                                                    <td colSpan="2" class="border px-4 py-2 text-md text-gray-500">{allList?.shop_id}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border px-4 py-2 font-bold text-right">Shop Address</td>
                                                    <td colSpan="2" class="border px-4 py-2 text-md text-gray-500">{allList?.shop?.address}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border px-4 py-2 font-bold text-right">Category ID</td>
                                                    <td colSpan="2" class="border px-4 py-2 text-md text-gray-500">{allList?.category_id}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border px-4 py-2 font-bold text-right">Product ID</td>
                                                    <td colSpan="2" class="border px-4 py-2 text-md text-gray-500">{allList?.id}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border px-4 py-2 font-bold text-right">Status</td>
                                                    <td colSpan="2" class="border px-4 py-2 text-md font-semibold text-{{ allList?.status === 'active' ? 'green' : 'red' }}-500">{allList?.status}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="mt-4 w-full">
                                        <label htmlFor="details_modal" onClick={() => showDetailsModel(allList?.id)} class="bg-black w-full text-white px-4 py-2 rounded-md">See Details</label>
                                    </div>
                                </div>


                            ))}
                        </div>
                    }

                    {/* product list end */}
                </div>
            </div>

            {/* card */}

            {/*Add product create modal  */}
            <input type="checkbox" id="adding-product" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box lg:w-full">

                    <div className="text-right">
                        <label htmlFor="adding-product" className="btn text-xl"><RiCloseFill /></label>
                    </div>
                    {/* Form Body start */}
                    <div className="card-body">

                        {/* add product form */}

                        <form onSubmit={handleSubmit(createProduct)} className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Product Name</label>

                                <input type='text' placeholder="Product Name" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: "Product name must be required"
                                        }
                                    })}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.name?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Category Id</label>
                                <select {...register("category")} className=" bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5">
                                    <option disabled selected>Select Category</option>

                                    {lists.map((list) =>
                                        <option value={list.id}>{list.name}</option>
                                    )}
                                </select>
                                <p className='text-left text-xs text-red-500'>{errors.categoryId?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Shop Id</label>
                                <select {...register("shop")} className=" bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5">
                                    <option disabled selected>Select Shop</option>

                                    {shopLists.map((list) =>
                                        <option value={list.id}>{list.name}</option>
                                    )}
                                </select>
                                <p className='text-left text-xs text-red-500'>{errors.shop?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Price</label>

                                <input type='text' placeholder="Price" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                    {...register("price", {
                                        required: {
                                            value: true,
                                            message: "Price must be required"
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "Only give number."
                                        },
                                    })}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.price?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Offer Price</label>

                                <input
                                    type='text'
                                    placeholder="Offer Price"
                                    className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"


                                    {...register("offerPrice")}
                                />

                                {/* <p className='text-left text-xs text-red-500'>{errors.offerPrice?.message}</p> */}
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Status</label>
                                <select {...register("status")} className=" bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5">
                                    <option disabled selected>Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                                <p className='text-left text-xs text-red-500'>{errors.status?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Description</label>

                                <textarea type='text' placeholder="Long Description" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                    {...register("description", {
                                        required: {
                                            value: true,
                                            message: "Description must be required"
                                        },
                                    })}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.description?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Short Description</label>

                                <textarea type='text' placeholder="Short Description" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                    {...register("description_srt", {
                                        required: {
                                            value: true,
                                            message: "Short Description must be required"
                                        },
                                    })}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.description_srt?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Stock</label>

                                <input type='text' placeholder="weight" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                    {...register("stock", {
                                        required: {
                                            value: true,
                                            message: "stock must be required"
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "Only give number."
                                        },
                                    })}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.stock?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 text-left">Weight</label>

                                <input type='text' placeholder="weight" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5" required=""
                                    {...register("weight", {
                                        required: {
                                            value: true,
                                            message: "weight must be required"
                                        },
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: "Only give number."
                                        },
                                    })}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.weight?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="Profile" className="block mb-2 text-sm font-medium text-gray-900 text-left">Main Image</label>

                                <input type='file' className="file-input file-input-bordered rounded-lg file-input-sm w-full " required=""
                                    {...register("mainImage", {
                                        required: {
                                            value: true,
                                            message: "Main picture must be required"
                                        },
                                    })}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file && file.size > 4 * 1024 * 1024) {
                                            e.target.value = null; // Clear the selected file
                                            toast.error("Image size must be less than 4MB");
                                        }
                                    }}
                                />
                                <p className='text-left text-xs text-red-500'>{errors.mainImage?.message}</p>
                            </div>
                            <div>
                                <label htmlFor="Profile" className="block mb-2 text-sm font-medium text-gray-900 text-left">Gallery Image Image</label>
                                {currentPage === "choose-img" ? (
                                    <FileInput setImage={setImage} onImageSelected={onImageSelected} />
                                ) : currentPage === "crop-img" ? (
                                    <ImageCropper
                                        image={image}
                                        onCropDone={onCropDone}
                                        onCropCancel={onCropCancel}
                                        style={{position: "absolute", bottom:"-5%"}}
                                    />
                                ) : (
                                    <div>
                                        <div>
                                            <img src={imgAfterCrop} className="cropped-img" alt='' />
                                        </div>

                                        <button
                                            onClick={() => {
                                                setCurrentPage("crop-img");
                                            }}
                                            className="btn"
                                        >
                                            Crop
                                        </button>

                                        <button
                                            onClick={() => {
                                                setCurrentPage("choose-img");
                                                setImage("");
                                            }}
                                            className=""
                                        >
                                            New Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="card-actions justify-center">
                                <button htmlFor="adding-product" type="submit" className="btn w-full btn-primary">Add Product</button>
                                {/* <label htmlFor="adding-product" className="btn">Yay!</label> */}
                            </div>

                        </form>
                    </div>
                    {/* form body end */}
                    <div className="modal-action">
                        <label htmlFor="adding-product" className="btn">Close</label>
                    </div>
                </div>
            </div>
            {/* end model */}



            {/* product Edit and update modal start */}

            {/* The button to open modal */}
            {/* <label htmlFor="product_update_modal" className="btn">open modal</label> */}

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="product_update_modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-1/2 max-w-auto">
                    <div className='text-right'>
                        <label htmlFor="product_update_modal" className="btn text-xl"><RiCloseFill /></label>
                    </div>
                    {/* <form onSubmit={handleSubmit(handleCreateCategory)} className="space-y-4 md:space-y-6"> */}
                    <div>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Product Id/Name:</label>
                        <select type="text" onChange={(e) => setProductId(e.target.value)} className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" placeholder="123456789">
                            <option selected disabled>Select Product</option>
                            {listproducts.map((list) =>
                                <option value={list.id}>{list.name}</option>
                            )}
                        </select>
                        {/* <p className='text-left text-xs text-red-500'>{errors.shopId?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Shop Name:</label>
                        <select type='text' onChange={(e) => setShopId(e.target.value)} placeholder="category name" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="">
                            <option selected disabled>select Shop</option>
                            {shopLists.map((list) =>
                                <option value={list.id}>{list.name}</option>
                            )}
                        </select>
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Product Name</label>

                        <input type='text' onChange={(e) => setProductname(e.target.value)} placeholder="edit product name" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="" />
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Product Price</label>

                        <input type='text' onChange={(e) => setProductPrice(e.target.value)} placeholder="edit product price" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="" />
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Offer Price</label>

                        <input type='text' onChange={(e) => setOfferPrice(e.target.value)} placeholder="edit product offer price" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="" />
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Product Description</label>

                        <textarea type='text' onChange={(e) => setProductDetails(e.target.value)} placeholder="edit product details" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="" />
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Short Description</label>

                        <textarea type='text' onChange={(e) => setShortDetails(e.target.value)} placeholder="edit product short details" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="" />
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="text" className="block mb-1 text-sm font-medium text-gray-900 text-left">Stock</label>

                        <input type='number' onChange={(e) => setStock(e.target.value)} placeholder="edit stock" className="bg-gray-50 border border-gray-300 text-[#0A0A0A] text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5" required="" />
                        {/* <p className='text-left text-xs text-red-500'>{errors.categoryName?.message}</p> */}
                    </div>

                    <div className="card-actions mt-4 justify-center">
                        <button onClick={updateProduct} type='submit' className="btn w-full btn-primary">Updated Product</button>
                    </div>

                    {/* </form> */}
                    <div className="modal-action">
                        <label htmlFor="product_update_modal" className="btn">close</label>
                    </div>
                </div>
            </div>


            {/* product Edit and update modal start */}

            {/* show details modal */}

            {/* The button to open modal */}
            {/* <label htmlFor="details_modal" className="btn">open modal</label> */}

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="details_modal" className="modal-toggle" />
            <label htmlFor="details_modal" className="modal cursor-pointer">

                <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">
                    <img className="object-cover w-full rounded-t-lg lg:h-1/2 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={showDetails?.data?.gallery[0]?.original_url} alt="" />
                    <div className="flex flex-col justify-between p-4 leading-normal">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight">{showDetails?.data?.name}</h5>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{showDetails?.data?.long_description}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400"><span className='text-bold text-black'>Price:</span>{showDetails?.data?.price}.</p>
                    </div>
                </div>


            </label>



            <Toaster />
        </div>
    );
};

export default Product;




