import {useEffect, useState, useContext} from 'react';
import {Outlet} from "react-router-dom";
import {useAuth} from "../../context/auth.jsx";
import Loading from "./Loading.jsx";
import axios from 'axios';

export default function PreivateRoute(){
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const authCheck = async () => {
            const {data} = await axios.get(
                `${import.meta.env.VITE_API}/auth-check`, 
                {
                    headers: {
                        Authorization: auth?.token,
                    },
                }
            );
            if(data.ok){
                setOk(true);
            }else{
                setOk(false);
            }
        };
        authCheck();
    }, [auth?.token]);

    // useEffect(() => {
    //     if(auth?.token){
    //       setOk(true);  
    //     }else{
    //         setOk(false);
    //     }
    // }, [auth?.token]);

    return ok ? <Outlet/> : <Loading/> ;
};