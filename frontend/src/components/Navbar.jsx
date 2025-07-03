import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import modsCraftLogo from "../assets/ModsCraft_logo.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'non-home' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" className='logo-link'>
          <img src={modsCraftLogo} alt='modcraft_logo'/>
          </Link>
        </div>
        
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className='nav-links-container'>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>HOME</Link>
          </li>
          <li className="nav-item">
            <Link to="/terms-of-use" className="nav-link" onClick={closeMenu}>Terms of Use</Link>
          </li>
          <li className="nav-item">
            <Link to="/privacy-policy" className="nav-link" onClick={closeMenu}>PRIVACY</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>CONTACT</Link>
          </li>
          <li className="nav-item mobile-get-app">
            <Link to="/installation-steps" className="nav-link get-app-mobile" onClick={closeMenu}>GET APP</Link>
          </li>
        </ul>
        </div>
        <div className="nav-auth">
          <Link to="/installation-steps" className="get-app-btn">GET APP</Link>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 