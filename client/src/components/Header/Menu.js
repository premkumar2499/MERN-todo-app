import React,{useContext} from 'react'; 
import {Link} from 'react-router-dom'
import './Menu.scss'
import UserContext from '../../context/userContext';


const Menu = ({handleMenu}) =>{
    const {userData,setUserData,loading,setLoading} = useContext(UserContext)
    return(
        <div className="side-nav">
            <div className="title">
                {userData.userName ? (<div className="fs-1">Hello {userData.userName}</div>) : (<div>Prem Todos</div>)}
                <div className="close">
                    <button className="close-btn" onClick={handleMenu}>X</button> 
                </div>
            </div>
            <div className="links">
                    { userData.userName ? (
                        <>
                        <li class="nav-item">
                            <Link class="nav-link active" onClick={handleMenu} aria-current="page" to="/">Home</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" onClick={handleMenu} aria-current="page" to="/completed-todos">Completed todos</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" onClick={handleMenu} aria-current="page" to="/logout">Logout</Link>
                        </li>                        
                        </>
                    ) : (
                        <>
                        <li class="nav-item">
                            <Link class="nav-link active" onClick={handleMenu} aria-current="page" to="/login">Login</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" onClick={handleMenu} aria-current="page" to="/register">Register</Link>
                        </li>
                        </>
                    )}
            </div>
        </div>
    )
}

export default Menu;