import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import TokenAuth from '../../Authentication/TokenAuth/TokenAuth';

const Login = () => {
    // handle form validation and error handling
    const { setToken } = TokenAuth();

    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onTouched' });

    // Submit login button

    const handleLogin = async data => {
        const user = {
            phone: data.phone,
            password: data.password
        }
        // fetching data post
        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/merchant-login`, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "Success") {
                    toast.success("Login Successfully")
                } else {
                    toast.error(data.message)
                }
                setToken(data.data.access_token)
                // console.log(data)
            })
    }
    
    // handle show password icon
    const [toggle1, setToggle1] = useState(false);
    return (
        <div className='relative top-0 z-40 bg-white h-screen'>
            <section className=" container ">
                <div className="flex items-center  justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-black">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Login
                            </h1>
                            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-left text-white">Your Phone Number</label>
                                    <input type="text" className="bg-[#171717] border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" placeholder="01600012547"
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
                                            }
                                        })}
                                    />
                                    {/* error handling message */}
                                    <p className='text-xs text-red-500 text-left'>{errors.phone?.message}</p>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-left text-white   ">Password</label>

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
                                    {/* error handling message for password */}
                                    <p className='text-xs text-red-500 text-left'>{errors.password?.message}</p>
                                    <p className='text-right'><Link to='/reset-password' className='text-xs text-gray-500'>Forget Password</Link></p>
                                </div>
                                <button type="submit" className="w-full text-black bg-white hover:bg-[#171717] transition hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center">Log In</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    create an account  <Link to='/signup' className="font-medium text-primary-600 hover:underline">Sign Up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Toaster />
        </div>
    );
};

export default Login;