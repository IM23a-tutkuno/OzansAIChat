import React, {useEffect} from 'react';
import {Navigate, useLocation} from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const location = useLocation();
    const loggedIn = localStorage.getItem('loggedIn')


    if (loggedIn === '0') {
        return <Navigate to="/login" state={{from: location}}/>;
    }

    return loggedIn ? children : <Navigate to="/chat"/>;

}

export default ProtectedRoute;
