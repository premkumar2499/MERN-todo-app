import React, { useState, useContext, useEffect} from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../context/userContext";
import Axios from "axios";
import Loading from '../../components/Loading/Loading'

//Constants
import {HOST_URL} from '../../Constants'
import { validateEmpty,validateEmail, validatePassword, comparePassword } from "./Validation";


const Register = () =>{
    const { userData,setUserData,loading,setLoading } = useContext(UserContext);

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    //setErrors
    const [firstNameError,setFirstNameError] = useState(undefined);
    const [lastNameError,setLastNameError] = useState(undefined);
    const [emailError, setEmailError] = useState(undefined);
    const [passwordError, setPasswordError] = useState(undefined);
    const [confirmPasswordError,setConfirmPasswordError] = useState(undefined);
    const [error, setError] = useState([]);

    //set Button state
    const [btnState,setBtnState] = useState(false);

    const history = useHistory();
    if(userData.status === 'active'){
      history.push("/");
    }
    else if(userData.status === 'pending'){
      history.push("/verify-mail");
    }

    useEffect(()=>{
      const mountRegister = () =>{
      if(firstNameError === null && lastNameError === null && emailError === null && passwordError === null && confirmPasswordError === null){
        setBtnState(true);
      }
      else{
        setBtnState(false);
      }
      }
      mountRegister()
    }, [firstNameError,lastNameError,emailError,passwordError,confirmPasswordError]);

    const submit = async (e) => {
        e.preventDefault();
    
        try {
          setLoading(true);
          const newUser = { firstName, lastName, email, password, confirmPassword };
          console.log(newUser);
          
          const regUser = await Axios.post(`${HOST_URL}/api/auth/register`, newUser);
          if(regUser.data.errors){
            const err = regUser.data.errors.map(e =>{
              return (
                <div class="alert alert-danger">{e.msg}</div>
              )
            })
            setError(err);
            setBtnState(false);
            setFirstNameError(undefined);
            setLastNameError(undefined);
            setEmailError(undefined);
            setPasswordError(undefined);
            setConfirmPasswordError(undefined);
          }
          else{
            localStorage.setItem("auth-token", regUser.data.accessToken);
            setUserData({
              token:regUser.data.accessToken
            })
            console.log(userData.token);
            history.push("/verify-mail");
          }
          console.log(regUser.data);
          setLoading(false);
        } catch (err) {
            console.log(err)
            err.response.data.msg && setError(err.response.data.msg);
        }
        
      };

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
                                  Prem Todos
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-body">
                            {error}
                            <form onSubmit={submit}>
                              <div className="form-group mb-1" id="formGroup">
                                <input
                                id="first-name"
                                placeholder="First Name"
                                className="form-control" 
                                type="text"
                                onChange={(e) => validateEmpty(e.target.value) ? 
                                  (setFirstName(e.target.value),setFirstNameError(null)) : (setFirstNameError("Firstname is required"))}
                                />
                                <small id="emailHelp" className="form-text text-danger mb-2">{firstNameError}</small>
                              </div>

                              <div className="form-group mb-1" id="formGroup">
                                <input
                                id="last-name"
                                placeholder="Last Name"
                                className="form-control" 
                                type="text"
                                onChange={(e) => validateEmpty(e.target.value) ? 
                                  (setLastName(e.target.value),setLastNameError(null)) : (setLastNameError("Lastname is required"))}
                                />
                                <small id="emailHelp" className="form-text text-danger mb-2">{lastNameError}</small>
                              </div>
                              <div className="form-group mb-1" id="formGroup">
                                      <input
                                        id="email"
                                        type="email"
                                        className="form-control" 
                                        aria-describedby="emailHelp"
                                        placeholder="E-mail"
                                        // onChange={(e) => setEmail(e.target.value)}
                                        onChange={(e) => validateEmail(e.target.value) ?
                                          (setEmailError(null),setEmail(e.target.value)) : (setEmailError("E-mail is required"))}
                                       />
                                       <small id="emailHelp" className="form-text text-danger mb-2">{emailError}</small>
                              </div>
                              <div className="form-group mb-1" id="formGroup">
                                  <input
                                      id="password"
                                      type="password"
                                      className="form-control"
                                      placeholder="Password"
                                      // onChange={(e) => setPassword(e.target.value)}
                                      onChange={(e) => validatePassword(e.target.value) ? 
                                        (setPasswordError(null),setPassword(e.target.value)) : (setPasswordError("Add 1 special character, 1 number, 1 A-Z letter, 1 a-z leeter, min 8 characters"),setConfirmPassword(undefined))}
                                      />
                                      <small id="emailHelp" className="form-text text-danger mb-2">{passwordError}</small>
                              </div>
                              <div className="form-group mb-1" id="formGroup">
                                <input
                                  type="password"
                                  placeholder="Confirm Password"
                                  className="form-control" 
                                  onChange={(e) => comparePassword(password,e.target.value) ? 
                                    (setConfirmPasswordError(null),setConfirmPassword(e.target.value)) : (setConfirmPasswordError("Passwords do not match"))}
                                  />
                                  <small id="emailHelp" className="form-text text-danger mb-2">{confirmPasswordError}</small>
                                </div>
                              <div className="container">
                                <div className="row pt-2">
                                  {(btnState) ? (
                                    <input type="submit" className="p-1 btn btn-primary" value="Register"/>
                                  ):(
                                    <input type="submit" className="p-1 btn btn-primary disabled" value="Register"/>
                                  )}
                                  
                                </div>
                              </div>
                              
                              <div className="container pt-2">
                                <div className="row">
                                    {/* <div className="col text-left">
                                        <Link to="/forget-password" className="active" style={{color: '#1a2e35'}}><i className="fa fa-user-plus"></i>Forgetten-Password?</Link>
                                        <button style="background-color: #1a2e35;" className="btn btn-primary">Log In</button> 
                                    </div> */}
                                    <div className="col text-right">
                                        <small className="form-text">Have An account?</small>
                                        <Link to="/login" className="active" style={{color: '#1a2e35'}}><i className="fa fa-user-plus"></i>Login</Link>
                                    </div>
                                </div>
                              </div>
                            </form>
                          </div>
                    </div>
                </div>
              </>            
          )}
          </div>
    )
}

export default Register;