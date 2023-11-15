import React from 'react';

const ShopCard = ({details}) => {
    return (
        <div className='container w-full'>
            <div className="card w-full bg-base-100 shadow-xl">
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
            </div>

        </div>
    );
};

export default ShopCard;