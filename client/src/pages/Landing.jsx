import React, { use, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import './Landing.css';

function Landing() {
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleregister=()=>{
    const navigate=useNavigate();
    navigate('/register');
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <div className="landing-header">
        <h1 className="site-title">BLOGNEST</h1>
        <ul className="landing-links">
          <li><button onClick={() => scrollToSection(featuresRef)}>Features</button></li>
          <li><button onClick={() => scrollToSection(aboutRef)}>About</button></li>
          <li><button onclick={handleregister}>Register</button></li>
          <li><a href="/Register">Register</a></li>
        </ul>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h2>Express Yourself Through Words</h2>
          <p>BlogNest is your digital home to write, share, and inspire.</p>
          <a href="/Register" className="cta-button">Start Writing</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <h2>Platform Features</h2>
        <div className="feature-cards">
          <div className="card">
            <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Easy Writing" />
            <h3>Easy Writing</h3>
            <p>Write blogs with a distraction-free editor tailored for expression.</p>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Community" />
            <h3>Engaging Community</h3>
            <p>Connect with readers and other writers through comments and shares.</p>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Analytics" />
            <h3>Blog Insights</h3>
            <p>Track views, likes, and comments with intuitive dashboards.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" ref={aboutRef}>
        <h2>About BlogNest</h2>
        <p>
          At BlogNest, we believe that everyone has a story to tell. Whether you're an experienced writer
          or just getting started, our platform provides the tools and space to bring your voice to life.
        </p>
        <img src="https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="About BlogNest" />
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 BlogNest. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;