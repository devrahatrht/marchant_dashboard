import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResetPasswordSet = () => {
    const number = localStorage.getItem('phone')
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const handleShowPassword = () => {
        setToggle2(!toggle2);
    }

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({ mode: 'onTouched' });
    const password = watch('password');
    const changePassword = async (data) => {
        const user = {
            phone: number,
            otp: data.otp,
            new_password: data.password
        }
        console.log(user)

        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/reset-merchant-password`, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                if (data.success === true) {
                    toast.success("Successfully Change Password");
                    localStorage.removeItem('phone')
                    navigate("/login")
                } else {
                    toast.error(data.message);
                    console.log(data)
                }
                reset()
            })
    }
    return (
        <div className='relative top-0 z-40'>
            <section className=" bg-white">
                <div className="flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-black">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Set Password
                            </h1>
                            <form onSubmit={handleSubmit(changePassword)} className="space-y-4 md:space-y-6">
                                
                                <div>

                                    <label htmlFor="text" className="block mb-2 text-sm text-left font-medium text-white">Otp</label>
                                    <input type="text" className="bg-[#171717] border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2  " placeholder="1234"
                                        {...register("otp", {
                                            required: {
                                                value: true,
                                                message: "Number is Required"
                                            },
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Only give number."
                                            },
                                           
                                            maxLength: {
                                                value: 4,
                                                message: "must be give otp"
                                            }
                                        })}
                                    />
                                    {/* phone number error handling */}
                                    <p className='text-xs text-red-500 text-left'>{errors.otp?.message}</p>
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
                                <button type="submit" className="w-full text-black bg-white hover:bg-[#171717] transition hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center">Change Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Toaster></Toaster>
        </div>
    );
};

export default ResetPasswordSet;