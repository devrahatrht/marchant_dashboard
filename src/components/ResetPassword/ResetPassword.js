import React from 'react';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {


    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const resetPassword = async (data) => {
        const user = {
            phone: data.phoneNumber
        }
        const phoneData = data.phoneNumber;
        console.log(user)

        fetch(`${process.env.REACT_APP_SECRET_API_MERCHANT}/reset-merchant-password-request`, {
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
                    toast.success("Sent otp code");
                    // setToken(data.data.access_token)
                    localStorage.setItem('phone', phoneData)
                    navigate("/set-password")
                } else {
                    toast.error(data.message);
                    console.log(data)
                }
                reset()
            })
    }
    return (
        <div className='relative top-0 z-40 bg-white h-screen'>
            <section className=" container ">
                <div className="flex items-center  justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 bg-black">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Reset Password
                            </h1>
                            <form onSubmit={handleSubmit(resetPassword)} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-left text-white">Your Phone Number</label>
                                    <input type="text" className="bg-[#171717] border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2" placeholder="01600012547"
                                        {...register("phoneNumber", {
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
                               
                                <button type="submit" className="w-full text-black bg-white hover:bg-[#171717] transition hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center">Reset Password</button>
                            
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Toaster />
        </div>
    );
};

export default ResetPassword;