import React, { use, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import './Landing.css';

function Landing() {
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const navigate=useNavigate();

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleregister=()=>{
    
    navigate('/register');
  }
  const handlelogin=()=>{
    
    navigate('/login');
  }

  return (
    <div className="landing-page">
      {/* Header */}
      <div className="landing-header">
        <navbar className="navbar">
        <h1 className="site-title">BLOGNEST</h1>
        <ul className="landing-links">
          <li><button onClick={() => scrollToSection(featuresRef)}>Features</button></li>
          <li><button onClick={() => scrollToSection(aboutRef)}>About</button></li>
          <li><button onClick={handlelogin}>Login</button></li>
          <li><button onClick={handleregister}>Register</button></li>
        </ul>
        </navbar>
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
            <img src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJsb2d8ZW58MHx8MHx8fDA%3D" alt="Easy Writing" height={200}/>
            <h3>Easy Writing</h3>
            <p>Write blogs with a distraction-free editor tailored for expression.</p>
          </div>
          <div className="card" >
            <img src="https://media.istockphoto.com/id/1289323170/photo/visual-contents-concept-social-networking-service-streaming-video-communication-network.jpg?s=612x612&w=0&k=20&c=5tCsSD5HSUIg1VYBeTosaQeQT48Rgc6A0_XtS8N1laU=" alt="Community" height={200}/>
            <h3>Engaging Community</h3>
            <p>Connect with readers and other writers through comments and shares.</p>
          </div>
          <div className="card">
            <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*yBt65HhmARbqZDDJ1McFDg.png" alt="Analytics" height={200}/>
            <h3>Blog Insights</h3>
            <p>Track views, likes, and comments with intuitive dashboards.</p>
          </div>
          <div className="card">
            <img src="https://t3.ftcdn.net/jpg/08/18/68/52/240_F_818685245_XK51vlOImTytftYxAMY52gZnm0ROU9yn.jpg" alt="Analytics" height={200}/>
            <h3>Blog Insights</h3>
            <p>Track views, likes, and comments with intuitive dashboards.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" ref={aboutRef}>
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
  <img
    src="https://cdn.pixabay.com/photo/2016/11/29/04/17/blog-1868770_1280.jpg"
    alt="Writers working on blogs in a modern workspace"
    style={{ width: '100%', borderRadius: '12px', marginTop: '20px' }}
  />
</section>


      {/* Footer */}
      
        
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-column">
        <h3>Help</h3>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Help Forum</a></li>
          <li><a href="#">Video Tutorials</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>Community</h3>
        <ul>
          <li><a href="#">Blogger Buzz</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>Developers</h3>
        <ul>
          <li><a href="#">Blogger API</a></li>
          <li><a href="#">Developer Forum</a></li>
        </ul>
      </div>
    </div>

    <hr class="divider" />

    <div class="footer-bottom">
      <div class="footer-links">
        <a href="#">Terms of Service</a>
        <span class="divider-line">|</span>
        <a href="#">Privacy</a>
        <span class="divider-line">|</span>
        <a href="#">Content Policy</a>
      </div>
      
    </div>
  </footer>



      <footer className="footers">
        <p>© 2025 BlogNest. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;