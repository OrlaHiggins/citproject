import React, { useState } from 'react';
import './AboutUs.css';
import './background.css';
import { Link } from 'react-router-dom';

const AboutUs = ({ userName }) => {
  console.log('Rendering HomePage component');

  // State variables
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState(
    'This is a simple example of a home page with React.'
  );

  // Function to change content dynamically
  const changeContent = () => {
    setPageContent('Content changed dynamically!');
  };

  return (
    <div className="homepage-container">
      <section className="about-us">
        <h2>About Us</h2>
      </section>
      <section className="white-section">
        <div className="centered-container">
          <div className="content-wrapper">
            <div className="text-bubble">
              <p>
                At Trolley Tracker, we are committed to making your shopping experience smoother
                and more convenient. Our mission is to provide a reliable platform that helps
                you keep track of your shopping carts, ensuring they are always where you need
                them.
              </p>
            </div>
            <div className="text-bubble">
              <p>
                Founded with the idea of enhancing the efficiency of your grocery shopping,
                Trolley Tracker offers a user-friendly solution to the common problem of
                misplaced shopping carts. Whether you're at a supermarket, department store, or
                any retail location using shopping carts, our platform is designed to make your
                shopping trips hassle-free.
              </p>
            </div>
            <div className="text-bubble">
              <p>
                Explore Trolley Tracker and make your shopping experience more enjoyable.{' '}
                <Link to="/signup">Sign up</Link> now!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;