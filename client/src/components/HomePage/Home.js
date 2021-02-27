import React, {  useContext, useDebugValue, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";


import UserContext from "../../context/userContext";
import Axios from 'axios'
import Loading from '../Loading/Loading';
import { HOST_URL } from '../../Constants'


const Home = () =>{
    const {userData,loading,setLoading} = useContext(UserContext);
    const history = useHistory();
    const token = localStorage.getItem('auth-token');
    useEffect(()=>{
        if(userData.token){
            history.push('/userhome');
        }
        console.log(loading);
        const MountHome = async() => {
            if(userData.status === 'pending'){
                Axios.get(`${HOST_URL}/api/auth/verification/get-activation-email`, { headers: {"Authorization" : `Bearer ${userData.token}`} })
                    .then((res)=>{
                        console.log(res.data);
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                history.push('/verify-mail');
            }
            console.log(loading);
            console.log(userData);
            setLoading(false);
        };   
        MountHome();
    }, [loading,userData]);
    return(
        
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            { loading ? (
                <Loading/>
            ) : (
                    <>
                        <div className="d-flex flex-column justify-content-evenly align-items-center h-25">
                            <h2 className="text-center">Welcome to your personalized TODO APP</h2>
                            <Link className="btn btn-outline-primary fs-4" to="/login">Log in</Link>  
                            <Link className="btn btn-outline-primary" to="/register">Register</Link>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Home;