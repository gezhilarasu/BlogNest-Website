import React, { useState, useEffect, useRef } from 'react';
import{useNavigate} from 'react-router-dom';
import './navbar.css'; // Ensure you have the correct path to your CSS file
const Navbar = () => {
    const navigate=useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (menuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [menuOpen]);

  const handleNavClick1 = (section) => {
    navigate('/createpost');
  };
  const handleNavClick2 = (section) => {
    navigate('/myposts');
  };
  

  return (
    <div >
      <nav className="navbar1" ref={navRef}>
        {/* Logo */}
        <div className="nav-item1">
          <span className="logo-gradient">BLOG</span>
          <span className="logo-accent">NEST</span>
        </div>

        {/* Menu Icon for Mobile */}
        <div className="menu-icon" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>

        {/* Nav Links */}
        <ul className={`navbar-nav1 ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item2">
            <button className="fav-link" onClick={() => handleNavClick1('favourite')}>
              <span className="link-icon">💖</span>
              FAVOURITE
            </button>
          </li>
          <li className="nav-item2">
            <button className="fav-link new-post-btn" onClick={() => handleNavClick1('new-post')}>
              <span className="link-icon">✨</span>
              NEW POST +
            </button>
          </li>
          <li className="nav-item2">
            <button className="fav-link" onClick={() => handleNavClick2('your-posts')}>
              <span className="link-icon">📝</span>
              YOUR POSTS
            </button>
          </li>
          <li className="nav-item3">
            <div className="profile-avatar" title="Profile">
              <span>U</span>
            </div>
          </li>
        </ul>
      </nav>

      
    
      </div>)}
export default Navbar;