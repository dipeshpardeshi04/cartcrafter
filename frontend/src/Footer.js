import React from "react";
import "./styles/Footer.css";
// import { assets } from "./assets.js";

const footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img id="footer-logo" src={"https://www.brandinginasia.com/wp-content/uploads/2023/01/Craft-Worldwide.png"} alt="" />
          <p>
          Welcome to CartCrafter! A user-friendly platform where local businesses can showcase their shops and products online, connecting with a wider audience effortlessly. Join today and grow your business digitally!
          </p>
          
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul className="footer-ul">
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right footer-ul">
            <h2>Contact</h2>
            <ul>
                <li>Dipesh Pardeshi</li>
                <li>9075050300</li>
                <li>pardeshidipesh9050@gmail.com</li>
            </ul>
            <div className="footer-social-icon">
            <a href="https://www.facebook.com/dipesh.pardeshi.505"><img className="fimg"  src={"https://static.vecteezy.com/system/resources/previews/021/869/133/non_2x/facebook-icon-logo-free-vector.jpg"} alt="" /></a>
            <a href="https://www.linkedin.com/in/dipeshpardeshi/"><img className="fimg" src={"https://blog.waalaxy.com/wp-content/uploads/2021/01/LinkedIn-Symbole.png"} alt="" /></a>
            <a href="https://www.instagram.com/dipesh_pardeshi04/"><img className="fimg" src={"https://www.pngmart.com/files/13/Instagram-Logo-PNG-Image-1.png"} alt="" /></a>
          </div>
        </div>
      </div>
      <hr/>
      
      <p className="footer-copyright">© 2024 CartCrafter. All rights reserved | Developed by Dipesh Pardeshi</p>
    </div>
  );
};

export default footer;
