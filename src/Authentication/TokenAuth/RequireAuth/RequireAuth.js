import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import TokenAuth from '../TokenAuth';

const RequireAuth = ({ children }) => {

    const {getToken} = TokenAuth();
    const location = useLocation();


        if (!getToken()) {
            return <Navigate to='/login' state={{ from: location }} replace></Navigate>
        }

    return children;
};

export default RequireAuth;