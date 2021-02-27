import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Header.scss';
import Menu from './Menu';

const Header = () =>{
    const [isOpen,setIsOpen] = useState(false);
    const handleMenu = () =>{
        console.log(isOpen);
        setIsOpen(!isOpen);
    }
    return(
        <div>
            <nav className="navbar navbar-light">
                <div className="nav-brand">
                    <button className="navbar-toggler" onClick={handleMenu} type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon icon"></span>
                    </button>
                </div>
                <div class="nav-title">
                    <Link className="navbar-brand fs-1" to="/">Prem TODO</Link>
                </div>
            </nav>
            {isOpen && <Menu handleMenu={handleMenu}/>}

            {/* <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                        <Link class="navbar-brand" to="/">Prem Todos</Link>
                    <div class="collapse navbar-collapse sidenav" id="navbarTogglerDemo03">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" aria-current="page" to="/completed">Completed Todos</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" aria-current="page" to="/logout">Logout</Link>
                            </li>
                        </ul>
                </div>
                </div>
            </nav> */}
        </div>
    )
}

export default Header;