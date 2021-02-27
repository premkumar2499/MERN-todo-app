import React, { useState, useContext, useEffect } from "react";
import { useHistory,Link } from "react-router-dom";
import Axios from "axios";

//components
import Loading from "../Loading/Loading";
import UserContext from "../../context/userContext";

//Constants
import {HOST_URL} from '../../Constants'
import { validateEmail, validateEmpty } from './Validation'


const Login = () =>{
    const { userData, setUserData } = useContext(UserContext);
    const [loginLoading,setLoginLoading ] = useState(false);
    const [email, setEmail] = useState();
    const [emailError,setEmailError] = useState(undefined);
    const [passwordError,setPasswordError] = useState(undefined);
    const [btnState,setBtnState] = useState(false)
    const [password, setPassword] = useState();
    const [error, setError] = useState([]);

    
    const history = useHistory();

    if(userData.status === 'active'){
      history.push("/");
    }
    else if(userData.status === 'pending'){
      history.push("/verify-mail");
    }

    useEffect(()=>{
      const checkCredentials = () =>{
        if(emailError === null && passwordError === null){
          setBtnState(true);
        }
        else{
          setBtnState(false);
        }
      }
      checkCredentials();
    },[emailError,passwordError,btnState]);
    
    const submit = async (e) => {
      e.preventDefault();
  
      try {
        setLoginLoading(true);
        const loginRes = await Axios.post(`${HOST_URL}/api/auth/login`, {
          email,
          password
        });
        if(loginRes.data.success){
          console.log(loginRes);
          setUserData({
            token: loginRes.data.accessToken,
            status:loginRes.data.userStatus
          })
          localStorage.setItem("auth-token", loginRes.data.accessToken);
          history.push("/userhome");
        }
        else{
            const err = loginRes.data.errors.map(e =>{
              return (
                <div class="alert alert-danger">{e.msg}</div>
              )
            })
            setError(err);
        }
        setLoginLoading(false);
        
      } catch (err) {
        err.response.data.msg && setError(err.response.data.msg);
      }
    };
    

    return(
      
      <div className="d-flex justify-content-center align-items-center vh-100">
            { loginLoading ? (
                 <Loading/>
             ) : (
                <>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <div className="container">
                              <div className="row">
                                <div className="col font-weight-bold fs-2">
                                  Prem Todos
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-body">
                              {error}
                              <form onSubmit={submit}>
                              <div className="form-group " id="formGroup">
                                      <input
                                      id="email"
                                      type="email"
                                      className="form-control mb-1" 
                                      aria-describedby="emailHelp"
                                      placeholder="E-mail"
                                      // onChange={(e) => setEmail(e.target.value)}
                                      // onChange={(e) => checkMail(e.target.value)}
                                      onChange={(e) => validateEmail(e.target.value) ?
                                         (setEmailError(null),setEmail(e.target.value)) : (setEmailError("Enter valid E-mail"))}
                                      />
                                <small id="emailHelp" className="form-text text-danger mb-2">{emailError}</small>
                              </div>
                              <div className="form-group">
                                <input
                                        id="password"
                                        type="password"
                                        className="form-control mb-1"
                                        placeholder="Password"
                                        // onChange={(e) => setPassword(e.target.value)}
                                        onChange={(e) => validateEmpty(e.target.value) ? 
                                          (setPasswordError(null),setPassword(e.target.value)) : (setPasswordError("Password is required"))}
                                        />
                                  <small id="emailHelp" className="form-text text-danger mb-2">{passwordError}</small>
                              </div>
                              <div className="container">
                                <div className="row pt-2">
                                  {  btnState ?(
                                    <input type="submit" className="p-1 btn btn-primary" value="Login" />
                                  ):(
                                    <input type="submit" className="p-1 btn btn-primary disabled" value="Login" />
                                  )}
                                  
                                </div>
                              </div>
                              
                              <div className="container pt-2">
                                <div className="row">
                                    <div className="col text-left">
                                        <Link to="/forget-password" className="active" style={{color: '#1a2e35'}}><i className="fa fa-user-plus"></i>Forgetten-Password?</Link>
                                        {/* <button style="background-color: #1a2e35;" className="btn btn-primary">Log In</button> */}
                                    </div>
                                    <div className="col text-right">
                                        <small className="form-text">Don't have An account?</small>
                                        <Link to="/register" className="active" style={{color: '#1a2e35'}}><i className="fa fa-user-plus"></i>Register here</Link>
                                    </div>
                                </div>
                              </div>
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

export default Login;