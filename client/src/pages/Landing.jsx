import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const handleRegister = () => {
    navigate('/register');
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`landing-header ${isMenuOpen ? 'landing-header-menu-open' : ''}`}>
        <nav className="landing-navbar">
          <h1 className="landing-site-title">BLOGNEST</h1>
          
          {/* Menu Toggle Button */}
          <button 
            className={`landing-menu-toggle ${isMenuOpen ? 'landing-menu-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            
            <div className="landing-hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Navigation Links */}
          <ul className={`landing-nav-links ${isMenuOpen ? 'landing-nav-open' : ''}`}>
            <li><button onClick={() => scrollToSection(featuresRef)}>Features</button></li>
            <li><button onClick={() => scrollToSection(aboutRef)}>About</button></li>
            <li><button onClick={handleLogin} className="landing-auth-btn">Login</button></li>
            <li><button onClick={handleRegister} className="landing-auth-btn landing-register-btn">Register</button></li>
          </ul>
        </nav>
        
        {/* Full Menu Overlay */}
        <div className={`landing-menu-overlay ${isMenuOpen ? 'landing-menu-overlay-open' : ''}`}>
          <div className="landing-menu-content">
            <ul className="landing-menu-items">
              <li><button onClick={() => scrollToSection(featuresRef)} className="landing-menu-item">Features</button></li>
              <li><button onClick={() => scrollToSection(aboutRef)} className="landing-menu-item">About</button></li>
              <li><button onClick={handleLogin} className="landing-menu-item">Login</button></li>
              <li><button onClick={handleRegister} className="landing-menu-item landing-menu-register">Register</button></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-overlay"></div>
        <div className="landing-hero-content">
          <div className="landing-hero-text">
            <h2>Express Yourself Through Words</h2>
            <p>BlogNest is your digital home to write, share, and inspire.</p>
            <button onClick={handleRegister} className="landing-cta-button">
              Start Writing
            </button>
          </div>
        </div>
      </section>
     
      {/* Features Section */}
      <section className="landing-features-section" ref={featuresRef}>
        <div className="landing-container">
          <h2>Platform Features</h2>
          <div className="landing-feature-cards">
            <div className="landing-card">
              <div className="landing-card-image">
                <img src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJsb2d8ZW58MHx8MHx8fDA%3D" alt="Easy Writing" />
              </div>
              <div className="landing-card-content">
                <h3>Easy Writing</h3>
                <p>Write blogs with a distraction-free editor tailored for expression.</p>
              </div>
            </div>
            
            <div className="landing-card">
              <div className="landing-card-image">
                <img src="https://media.istockphoto.com/id/1289323170/photo/visual-contents-concept-social-networking-service-streaming-video-communication-network.jpg?s=612x612&w=0&k=20&c=5tCsSD5HSUIg1VYBeTosaQeQT48Rgc6A0_XtS8N1laU=" alt="Community" />
              </div>
              <div className="landing-card-content">
                <h3>Engaging Community</h3>
                <p>Connect with readers and other writers through comments and shares.</p>
              </div>
            </div>
            
            <div className="landing-card">
              <div className="landing-card-image">
                <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*yBt65HhmARbqZDDJ1McFDg.png" alt="Analytics" />
              </div>
              <div className="landing-card-content">
                <h3>Blog Insights</h3>
                <p>Track views, likes, and comments with intuitive dashboards.</p>
              </div>
            </div>
            
            <div className="landing-card">
              <div className="landing-card-image">
                <img src="https://t3.ftcdn.net/jpg/08/18/68/52/240_F_818685245_XK51vlOImTytftYxAMY52gZnm0ROU9yn.jpg" alt="Customization" />
              </div>
              <div className="landing-card-content">
                <h3>Customization</h3>
                <p>Personalize your blog with beautiful themes and layouts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="landing-about-section" ref={aboutRef}>
        <div className="landing-container">
          <div className="landing-about-content">
            <h2>About BlogNest</h2>
            <p>
              At <strong>BlogNest</strong>, we believe everyone has a story worth sharing. Whether you're a seasoned
              blogger or just getting started, our platform empowers you to express your thoughts, ideas, and passions
              without limits.
            </p>
            <p>
              With a user-friendly interface, customizable themes, and powerful editing tools, BlogNest makes blogging
              effortless and enjoyable. From personal journals to professional articles, you can publish content that
              resonates with your audience and builds your digital presence.
            </p>
            <p>
              We also foster a vibrant community of readers and writers, encouraging interaction through comments,
              likes, and shares. At BlogNest, your words matter — and we're here to help them reach the world.
            </p>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-content">
            <div className="landing-footer-column">
              <h3>Help</h3>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">about</a></li>
                <li><a href="#">Video Tutorials</a></li>
              </ul>
            </div>
            <div className="landing-footer-column">
              <h3>Community</h3>
              <ul>
                <li><a href="#">Blogger Buzz</a></li>
                <li><a href="#">Writer's Circle</a></li>
                <li><a href="#">Success Stories</a></li>
              </ul>
            </div>
            <div className="landing-footer-column">
              <h3>Developers</h3>
              <ul>
                <li><a href="#">BlogNest API</a></li>
                <li><a href="#">Developer Forum</a></li>
                <li><a href="#">Documentation</a></li>
              </ul>
            </div>
          </div>

          <hr className="landing-footer-divider" />

          
        </div>
      </footer>
    </div>
  );
}

export default Landing;