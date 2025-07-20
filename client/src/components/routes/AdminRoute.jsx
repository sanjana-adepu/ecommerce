import {useEffect, useState, useContext} from 'react';
import {Outlet} from "react-router-dom";
import {useAuth} from "../../context/auth.jsx";
import Loading from "./Loading.jsx";
import axios from 'axios';

export default function AdminRoute(){
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const adminCheck = async () => {
            const {data} = await axios.get(
                `/admin-check`);
            if(data.ok){
                setOk(true);
            }else{
                setOk(false);
            }
        };
        if (auth?.token) adminCheck();
    }, [auth?.token]);

    return ok ? <Outlet/> : <Loading path="admin"/> ;
};