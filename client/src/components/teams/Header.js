import React from "react";

import "./css/Header.css";
import Logo from "../../images/logo.png"

class Header extends React.Component{
    render(){
        const {onChange, search} = this.props;
        return(
            <div className="header-container">
                <div className="logo">
                    <img src={Logo} width="35px" height="35px"/>
                    <h3 className="logo-name">Timelyy</h3>
                </div>
                <div className="search-bar-container">
                    <input className="search-bar" type="text" onChange={onChange} value={search} placeholder="Search for something..."/> 
                </div>
            </div>
        )
    }
}

export default Header;