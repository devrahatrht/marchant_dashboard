import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import TokenAuth from '../../Authentication/TokenAuth/TokenAuth';

const Signup = () => {
    const {token, setToken} = TokenAuth()
    const navigate = useNavigate();
    // sin up form submit 

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({ mode: 'onTouched' });
    const handleRegister = async data => {
        const user = {
            name: data.name,
            phone: data.phone,
            password: data.password
        }
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant-register`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                if (data.success === true) {
                    toast.success("Successfully Create Account")
                    navigate("/login")
                } else {
                    toast.error(data.message)
                }
                setToken(data.data.access_token)
                reset()
                console.log(data)
            })

    };

    console.log(token);
        // check password event
        const password = watch('password');


    // handle show password icon
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const handleShowPassword = () => {
        setToggle2(!toggle2);
    }


    return (
        <div className='relative top-0 z-40'>
            <section className=" bg-white">
                <div className="flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-black">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Create and account
                            </h1>
                            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="text" className="block mb-2 text-left text-sm font-medium text-white">Your Name</label>
                                    <input type="text" className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 bg-[#171717] text-white" placeholder="Your Name"
                                        {...register("name", {
                                            required: {
                                                value: true,
                                                message: "Name is Required"
                                            },
                                            // pattern: {
                                            //     value: /[a-z]/,
                                            //     message: "only letter."
                                            // },
                                            minLength: {
                                                value: 3,
                                                message: "Al least 3 characters"
                                            }
                                        })} />

                                    {/* name error handling message */}

                                    <p className='text-xs text-red-500 text-left'>{errors.name?.message}</p>

                                </div>
                                <div>

                                    <label htmlFor="text" className="block mb-2 text-sm text-left font-medium text-white">Your Phone Number</label>
                                    <input type="text" className="bg-[#171717] border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2  " placeholder="01600012547"
                                        {...register("phone", {
                                            required: {
                                                value: true,
                                                message: "Number is Required"
                                            },
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Only give number."
                                            },
                                            minLength: {
                                                value: 11,
                                                message: "must be exceed 11 characters"
                                            },
                                            maxLength:{
                                                value: 11,
                                                message: "must be exceed 11 characters"
                                            }
                                        })}
                                    />
                                    {/* phone number error handling */}
                                    <p className='text-xs text-red-500 text-left'>{errors.phone?.message}</p>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-left text-white ">Password</label>

                                    {/* icon show password */}

                                    {(toggle1 === false) ? <RiEyeOffLine className='text-white cursor-pointer absolute mt-3 ml-[350px]' onClick={() => setToggle1(!toggle1)}></RiEyeOffLine> : <RiEyeLine className='text-red-500 cursor-pointer absolute mt-3 ml-[350px]' onClick={() => setToggle1(!toggle1)}></RiEyeLine>}


                                    {/* icon show password end*/}

                                    <input type={toggle1 ? "text" : "password"} placeholder="••••••••" className="bg-[#171717] border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""
                                        {...register("password", {
                                            required: {
                                                value: true,
                                                message: "Password is Required"
                                            },
                                            // pattern: {
                                            //     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                                            //     message: "Minimum six characters, at least one letter and one number"
                                            // },
                                            minLength: {
                                                value: 6,
                                                message: "Must be exceed 6 characters"
                                            }
                                        })}
                                    />

                                    {/* error handling password */}

                                    <p className='text-xs text-red-500 text-left'>{errors.password?.message}</p>
                                </div>
                                <div className=''>
                                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium  text-left text-white">Confirm password</label>

                                    {/* show confirm password */}

                                    {
                                        (toggle2 === false) ? <RiEyeOffLine className='text-white cursor-pointer absolute mt-3 ml-[350px]' onClick={handleShowPassword}></RiEyeOffLine> : <RiEyeLine className='text-red-500 cursor-pointer absolute mt-3 ml-[350px]' onClick={handleShowPassword}></RiEyeLine>
                                    }

                                    {/* show confirm password end */}


                                    <input type={toggle2 ? "text" : "password"} placeholder="••••••••" className="bg-[#171717] border  border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 text-white" required=""
                                        {...register("confirmpassword", {
                                            required: {
                                                value: true,
                                                message: "Password is Required"
                                            },
                                            validate:
                                                value => value === password || "The password do not match",
                                        })}
                                    />
                                    {/* error handling confirm password */}
                                    <p className='text-xs text-red-500 text-left'>{errors.confirmpassword?.message}</p>
                                </div>

  
                                <button type="submit" className="w-full text-black bg-white hover:bg-[#171717] transition hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center">Create an account</button>
                                <p className="text-sm font-light text-gray-500">
                                    Already have an account? <Link to='/login' className="font-medium text-primary-600 hover:underline 
                                    ">Log In</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Toaster></Toaster>
        </div>
    );
};

export default Signup;