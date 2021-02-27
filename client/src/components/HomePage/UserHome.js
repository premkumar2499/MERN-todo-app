import React, {  useContext, useDebugValue, useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

import Todos from '../Todos/Todos'
import AddTodo from '../Todos/AddTodo'
import UserContext from "../../context/userContext";
import Axios from 'axios'
import Loading from '../Loading/Loading';
import { HOST_URL } from '../../Constants'



const UserHome = () =>{
    const {userData,loading,setLoading} = useContext(UserContext);
    const [openAddTodo , setOpenAddTodo] = useState(false);
    const history = useHistory();
    // const token = localStorage.getItem('auth-token');
    if(!userData.token){
        history.push('/');
    }
    useEffect(()=>{
        const MountUserHome = async() => {
            if(!userData.userName){
                setLoading(true);
            }
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
        MountUserHome();
    }, [loading,userData]);
    const handleAddTodo = () =>{
        setOpenAddTodo(!openAddTodo);
    }
    return(
        
        <div className="container-fluid">
            { loading ? (
                <Loading/>
            ) : (
                <>
                    <div className="row justify-content-end">
                        <div className="col-sm-2 col-4">
                            <button className="btn btn-primary p-1 fs-5 p-lg-2 fs-lg-4" onClick={handleAddTodo}>Add Todo</button>
                        </div>
                    </div>
                    {openAddTodo && <AddTodo handleAddTodo={handleAddTodo} setOpenAddTodo={setOpenAddTodo} todos={userData.Todos}/>}
                    <Todos/>
                    {/* <Todos/> */}
                </>
            )}
                    
        </div>
    )
}

export default UserHome;