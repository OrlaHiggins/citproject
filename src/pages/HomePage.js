import React, { useState } from 'react';
import './HomePage.css';
// HomePage.js
import './background.css';
import { Link } from 'react-router-dom';


const HomePage = ({ userName }) => {
  console.log('Rendering HomePage component');

  // State variables
  const [pageTitle, setPageTitle] = useState(''); // Updated pageTitle
  const [pageContent, setPageContent] = useState(
    'This is a simple example of a home page with React.'
  );

  // Function to change content dynamically
  const changeContent = () => {
    setPageContent('Content changed dynamically!');
  };

  return (
    <div>
      <section className="about-us">
        <h2>About Us</h2>
      </section>
      <section className="white-section">
        <div className="centered-container">
          <div className="content-wrapper">
            <div className="text-bubble">
              <p>
                At Trolley Tracker, we are committed to making your shopping experience smoother and more convenient. Our mission is to provide a reliable platform that helps you keep track of your shopping carts, ensuring they are always where you need them.
              </p>
            </div>
            <div className="text-bubble">
              <p>
                Founded with the idea of enhancing the efficiency of your grocery shopping, Trolley Tracker offers a user-friendly solution to the common problem of misplaced shopping carts. Whether you're at a supermarket, department store, or any retail location using shopping carts, our platform is designed to make your shopping trips hassle-free.
              </p>
            </div>
            <div className="text-bubble">
              <p>Explore Trolley Tracker and make your shopping experience more enjoyable. <Link to="/signup"> Sign up</Link> now! </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
        
      {/* <section className="white-section">
        <div>
          <p>
            At Trolley Tracker, we are committed to making your shopping experience smoother and more convenient. Our mission is to provide a reliable platform that helps you keep track of your shopping carts, ensuring they are always where you need them.
          </p>
          <p>
            Founded with the idea of enhancing the efficiency of your grocery shopping, Trolley Tracker offers a user-friendly solution to the common problem of misplaced shopping carts. Whether you're at a supermarket, department store, or any retail location using shopping carts, our platform is designed to make your shopping trips hassle-free.
          </p>
          <p>
            <strong>What Sets Us Apart:</strong>
          </p>
          <ul>
            <li><strong>Intuitive Tracking:</strong> Our innovative tracking system allows you to locate nearby available shopping carts effortlessly.</li>
            <li><strong>Real-Time Updates:</strong> Get real-time updates on the availability and location of shopping carts, ensuring you spend less time searching and more time shopping.</li>
            <li><strong>User-Friendly Interface:</strong> Our platform is designed with simplicity in mind. Easily navigate through the app or website to find the information you need.</li>
            <li><strong>Community-driven:</strong> Join our community of shoppers who contribute to the accuracy of cart locations, creating a collaborative environment for a better shopping experience.</li>
          </ul>
          <p>
            Explore Trolley Tracker and make your shopping experience more enjoyable. Your convenience is our priority!
          </p>
        </div>

        {/* Additional Content */}
        {/* <section className="additional-content">
          <div className="testimonial-section">
            <h2>What Our Users Say</h2>
            <div className="testimonial">
              <p>"Trolley Tracker has made my grocery shopping experience so much easier. I love how I can always find a cart nearby!"</p>
              <p className="author">- Jane Doe</p>
            </div>
            <div className="testimonial">
              <p>"I appreciate the real-time updates provided by Trolley Tracker. It saves me a lot of time!"</p>
              <p className="author">- John Smith</p>
            </div>
          </div>
          
          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Sign up now to enjoy the benefits of Trolley Tracker.</p>
            <button className="cta-btn">Sign Up</button>
          </div>
        </section>
      </section>  */}
//     </div>
//   );
// };

// export default HomePage;









