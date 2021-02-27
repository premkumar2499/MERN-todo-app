import React, { useState, useContext, useEffect,createContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import Axios from "axios";
import Loading from "../Loading/Loading";

//Constants
import { HOST_URL } from '../../Constants'
import { validateEmail } from "./Validation";

const ForgetPassword = () =>{
    const { userData, loading, setLoading,email,setEmail } = useContext(UserContext);

    const [error, setError] = useState(undefined);
    const [emailError,setEmailError] = useState(undefined);
    
    const history = useHistory();
    
    console.log(loading);
    if(userData.status ==='active'){
        history.push('/')
    }
    const submit = async (e) => {
      e.preventDefault();
  
      try {
        setLoading(true);
        const passwordRes = await Axios.post(`${HOST_URL}/api/auth/password-reset/get-code`, {
          email
        });
        if(!passwordRes.data.success){
            const err = passwordRes.data.errors.map((e,index)=>{
                return(
                    <div class="alert alert-danger alert-dismissible fade show" role="alert" key={index}>
                        <small>{e.msg}</small>
                    </div>
                )
            })
            setEmailError(undefined);
            setError(err);
        }
        else{
            history.push("/reset-password");
        }
        setLoading(false);
        
      } catch (err) {
        err.response.data.msg && setError(err.response.data.msg);
      }
    };
    

    return(
            <div className="d-flex justify-content-center align-items-center vh-100">
                    { loading ? (
                        <Loading/>
                    ) : (
                        <>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    
                                    <div className="modal-header">
                                        <p className="fs-3">Get Password Reset Code</p>
                                    </div>
                                    <div className="modal-body">
                                        {error}
                                        <form onSubmit={submit}>
                                        <div className="form-group">
                                            <input
                                            id="email"
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter E-mail"
                                            // onChange={(e) => setEmail(e.target.value)}
                                            onChange={(e) => validateEmail(e.target.value) ? (
                                                setEmail(e.target.value),setEmailError(null)
                                                ) : (
                                                    setEmailError("E-mail is required")                                                    
                                            )
                                            }
                                            />
                                            <small id="emailHelp" className="form-text text-danger mb-2">{emailError}</small>
                                        </div>
                                            { (emailError || emailError === undefined) ? (
                                                <input type="submit" className="btn btn-success mt-4 disabled" value="Send Code" />
                                            ) : (
                                                <input type="submit" className="btn btn-success mt-4" value="Send Code" />
                                            ) }
                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                        )
                    }
                </div>
    )
}

export default ForgetPassword;