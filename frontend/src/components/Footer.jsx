import React from 'react';
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import modsCraftLogo from "../assets/ModsCraft_logo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
          <img src={modsCraftLogo} alt='modcraft_logo'/>
        <p className="footer-text">
          © 2025 Modcraft.com. All rights reserved.
        </p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
       <div className="footer-icons">
          <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="#"><i className="fab fa-facebook-f social-media-icon"></i></a>
          <a href="#"><i className="fab fa-instagram social-media-icon"></i></a>
          <a href="#"><i className="fas fa-envelope social-media-icon"></i></a>
        </div>
    </footer>
  );
};

export default Footer;
