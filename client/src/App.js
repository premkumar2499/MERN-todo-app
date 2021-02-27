import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useState,useEffect } from 'react';
import Axios from 'axios';



//components
import './App.css';
import Header from './components/Header/Header';
import Home from './components/HomePage/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register'
import VerifyMail from './components/auth/VerifyMail';
import ActivateAccount from './components/auth/ActivateAccount';
import ForgetPassword from './components/auth/ForgetPassword';
import ResetPassword from './components/auth/ResetPassword'
import Logout from './components/auth/Logout';
import UserHome from './components/HomePage/UserHome'
import CompletedTodos from './components/Todos/CompletedTodos'

//constants
import {HOST_URL} from './Constants';
import UserContext from "./context/userContext";



function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    status: undefined,
    userName:undefined,
    todos:[]
  });
  const [loading,setLoading] = useState(true);
  const [email,setEmail] = useState();


  
  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      let token = localStorage.getItem("auth-token");
      
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      console.log(loading);
      const tokenRes = await Axios.post(
        `${HOST_URL}/api/auth/validate-token`,
        null,
        { headers: {"Authorization" : `Bearer ${token}`} }
      );
      
      if (tokenRes.data) {
        let userRes;
        if(tokenRes.data.userStatus==='active'){
          userRes = await Axios.get(`${HOST_URL}/api/auth/todos`, { headers: {"Authorization" : `Bearer ${token}`}
        });          
        }
        setUserData({
          token,
          status: tokenRes.data.userStatus,
          userName: userRes ? userRes.data.name : undefined,
          todos: userRes ? userRes.data.todos : []
        });
      }
      setLoading(false);
      
    };

    checkLoggedIn();
  }, []);
  

  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData, loading, setLoading, email,setEmail}}>
          <Header />
          <main>
              <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/verify-mail" component={VerifyMail} />
              <Route path="/verify-account/:userId/:secretCode" component={ActivateAccount} />
              <Route path="/forget-password" component={ForgetPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/userhome" component={UserHome}/>
              <Route path="/logout" component={Logout}/>
              <Route path="/completed-todos" component={CompletedTodos}/>
              
            </Switch>
          </main>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
