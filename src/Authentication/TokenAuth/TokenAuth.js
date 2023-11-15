import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenAuth = () => {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return tokenString;
    }

    const [token, setToken] = useState(getToken());

    const saveToken = token => {
        localStorage.setItem('token', token);
        setToken(token);
        navigate('/')
    }
    return {
        setToken:saveToken,
        token,
        getToken,
    };
};

export default TokenAuth;