import React, { useState,useEffect, useContext,useCallback } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import UserContext from "../../context/userContext";
import Loading from "../Loading/Loading";

import { HOST_URL } from '../../Constants'
const VerifyMail = () =>{
    const [isSending,setIsSending] = useState(false);
    const {userData,loading,setLoading} = useContext(UserContext);
    const history = useHistory();
    

    const token = userData.token;
    useEffect(()=>{
        if(!userData.token){
            history.push('/register');
        }
        if(userData.status === 'pending'){
            Axios.get(`${HOST_URL}/api/auth/verification/get-activation-email`, { headers: {"Authorization" : `Bearer ${token}`} })
            .then((res)=>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
        }
        else if(userData.status === 'active'){
            history.push('/');
        }
        console.log(userData);
    })
    const ResendRequest = useCallback(async () => {
        // don't send again while we are sending
        if (isSending) return
        // update state
        setIsSending(true)
        setLoading(true);
        // send the actual request
        await Axios.get(`${HOST_URL}/api/auth/verification/get-activation-email`, { headers: {"Authorization" : `Bearer ${token}`} })
        .then((res)=>{
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        })
        // once the request is sent, update state again
        setIsSending(false)
        setLoading(false);
      }, [isSending]) // update the callback if the state changes
    // const handleResend = () =>{
    //     Axios.get(`${HOST_URL}/api/auth/verification/get-activation-email`, { headers: {"Authorization" : `Bearer ${token}`} })
    //     .then((res)=>{
    //         console.log(res);
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })
    //   console.log("clicked");  
    // }
    return(
        <div className="d-flex justify-content-center align-items-center vh-100">
        { loading ? (
            <Loading/>
        ) : (
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <p className="fs-3">An activation Mail has been sent to your mail.Please Check!</p>
                        <button className="btn btn-success" onClick={ResendRequest}>Resend Mail</button>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
    
}

export default VerifyMail;