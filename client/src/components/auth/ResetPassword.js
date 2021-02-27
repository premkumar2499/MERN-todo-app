import React, { useState, useContext, useEffect,useCallback } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import Loading from '../Loading/Loading'

import Axios from "axios";

//Constants
import {HOST_URL} from '../../Constants'
import { comparePassword, validateEmpty, validatePassword } from "./Validation";

const ResetPassword = () =>{
    const { userData, loading, setLoading,email,setEmail } = useContext(UserContext);
    console.log(email);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [code, setCode] = useState();
    const [passwordError, setPasswordError] = useState(undefined);
    const [confirmPasswordError,setConfirmPasswordError] = useState(undefined);
    const [codeError, setCodeError] = useState(undefined);
    const [error, setError] = useState(undefined);

    const [isSending,setIsSending] = useState(false);
    const [btnState, setBtnState] = useState(false);
    
    const history = useHistory();

    if(userData.status ==='active'){
        history.push('/')
    }
    if(!email){
        history.push('/forget-password');
    }
    
    useEffect(()=>{
      console.log(isSending);
      const mountResetPassword = () =>{
        if(passwordError === null && confirmPasswordError === null && codeError === null){
          setBtnState(true);
        }
        else{
          setBtnState(false);
        }
      }
      mountResetPassword();
    },[passwordError,confirmPasswordError,codeError,isSending]);

    const submit = async (e) => {
      e.preventDefault();
  
      try {
        setLoading(true);

        const passwordRes = await Axios.post(`${HOST_URL}/api/auth/password-reset/verify`, {
          email, password, confirmPassword, code
        });
        if(!passwordRes.data.success){
            const err = passwordRes.data.errors.map((e,index)=>{
                return(
                  <div class="alert alert-danger alert-dismissible fade show" role="alert" key={index}>
                    <small>{e.msg}</small>
                  </div>
                )
            })
            setError(err);
            setBtnState(false);
            setPasswordError(undefined);
            setConfirmPasswordError(undefined);
            setCodeError(undefined);
        }
        else{
            
            history.push("/login");
        }
        setLoading(false);
        
      } catch (err) {
        err.response.data.msg && setError(err.response.data.msg);
      }
    };
    const ResendRequest = useCallback(async () => {
        // don't send again while we are sending
        if (isSending) return
        // update state
        setIsSending(true)
        setLoading(true);
        // send the actual request
        await Axios.post(`${HOST_URL}/api/auth/password-reset/get-code`, {
          email
        });
        setError(<div class="alert alert-success alert-dismissible fade show" role="alert">
            <small>Password reset code has been sent to your mail</small>
        </div>)
        // once the request is sent, update state again
        setIsSending(false)
        setLoading(false);
      }, [isSending]) // update the callback if the state changes
    

    return(
      <div className="d-flex justify-content-center align-items-center vh-100">
          {loading?(
            <Loading/>
          ):(
            <>
                <div className="modal-dialog modal-dialog-centered custom-box" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="container">
                              <div className="row">
                                <div className="col font-weight-bold fs-2">
                                  <p className="fs-5">Reset Your Password</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-body">
                            {(email && error === undefined) ? (
                                  <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <small>Password reset code has been sent to your mail</small>
                                  </div>
                            ) : (
                              error
                            )}
                            <form onSubmit={submit}>
                              <div className="form-group mb-1" id="formGroup">
                                      <input
                                        id="email"
                                        type="email"
                                        className="form-control disabled" 
                                        aria-describedby="emailHelp"
                                        placeholder="E-mail"
                                        defaultValue={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                      />
                              </div>
                              <div className="form-group mb-1" id="formGroup">
                                  <input
                                      id="password"
                                      type="password"
                                      className="form-control"
                                      placeholder="Password"
                                      // onChange={(e) => setPassword(e.target.value)}
                                      onChange={(e) => validatePassword(e.target.value) ? (
                                        setPassword(e.target.value),setPasswordError(null)                                        
                                      ) : (
                                        setPasswordError("Add 1 special character, 1 number, 1 A-Z letter, 1 a-z leeter, min 8 characters")
                                      )}
                                  />
                                  <small id="emailHelp" className="form-text text-danger mb-2">{passwordError}</small>
                              </div>
                              <div className="form-group mb-1" id="formGroup">
                                <input
                                  type="password"
                                  placeholder="Confirm Password"
                                  className="form-control" 
                                  // onChange={(e) => setConfirmPassword(e.target.value)}
                                  onChange={(e) => comparePassword(password,e.target.value) ? (
                                    setConfirmPassword(e.target.value),setConfirmPasswordError(null)                                        
                                  ) : (
                                    setConfirmPasswordError("Password do not match")
                                  )}
                                  />
                                  <small id="emailHelp" className="form-text text-danger mb-2">{confirmPasswordError}</small>
                                </div>
                                <div className="form-group mb-1" id="formGroup">
                                  <input
                                    id="code"
                                    type="text"
                                    placeholder="Enter Code"
                                    className="form-control" 
                                    // onChange={(e) => setCode(e.target.value)}
                                    onChange={(e) => validateEmpty(e.target.value) ? (
                                      setCode(e.target.value),setCodeError(null)                                        
                                    ) : (
                                      setCodeError("Enter Code")
                                    )}
                                    />
                                    <small id="emailHelp" className="form-text text-danger mb-2">{codeError}</small>
                                </div>      
                              <div className="container">
                                <div className="row pt-2">
                                  { btnState ? (
                                    <input type="submit" className="p-1 btn btn-primary" value="Submit"/>
                                  ) : (
                                    <input type="submit" className="p-1 btn btn-primary disabled" value="Submit"/>
                                  )}
                                </div>
                              </div>
                              <button className="btn btn-success form-control mt-2" onClick={ResendRequest}>Resend Code</button>
                            </form>
                          </div>
                    </div>
                </div>
              </>            
          )}
          </div>
    )
}

export default ResetPassword;