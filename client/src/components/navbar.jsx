import React, { useState, useEffect, useRef } from 'react';
import{useNavigate} from 'react-router-dom';
import './navbar.css'; // Ensure you have the correct path to your CSS file

const Navbar = () => {
    const navigate=useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const handleNavClick1 = (section) => {
    navigate('/createpost');
    setMenuOpen(false);
  };
  
  const handleNavClick2 = (section) => {
    navigate('/myposts');
    setMenuOpen(false);
  };
  
  // Fetch user email from localStorage
  const userEmail = localStorage.getItem('BlogNest_username') || 'U';

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  // Close dropdown and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      if (navRef.current && !navRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, menuOpen]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('BlogNest_username');
    localStorage.removeItem('BlogNest_token');
    // Add any other items that need to be cleared
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div ref={navRef}>
      <nav className="navbar1">
        {/* Logo */}
        <div className="nav-item1">
          <span className="logo-gradient">BLOG</span>
          <span className="logo-accent">NEST</span>
        </div>

        {/* Hamburger Menu Button */}
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Nav Links - Will collapse on small screens */}
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
          <li className="nav-item3" ref={dropdownRef}>
            <div className="profile-avatar" title="Profile" onClick={toggleDropdown}>
              <span>{userEmail.charAt(0).toUpperCase()}</span>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="user-dropdown">
                  <button className="logout-btn" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar;