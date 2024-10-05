import React from 'react'
import "./styles/Navbar.css";
import { Link } from "react-router-dom";
const Navbar = ({setshowlogin,setshowloginAdmin}) => {
  return (
    <div>
       <header className="header">
       <Link to="/" style={{ textDecoration: 'none' }}><div className="logo">CartCrafter</div></Link>
              
              <div className="nav">
              
                <Link to="/"><button className="publish-btn">Home</button></Link>
                <Link to="/Owner"><button className="publish-btn">See Shops</button></Link>
                <Link to="/Card"> <button className="publish-btn">Cart</button></Link>
                <button onClick={() => setshowloginAdmin(true)} className="publish-btn">Publish Shop</button>
                  <button onClick={() => setshowlogin(true)} className="profile-icon1">
                    👤
                  </button>
                  
              </div>
            </header>
    </div>
  )
}

export default Navbar


