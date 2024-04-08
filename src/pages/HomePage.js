import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const Homepage = () => {
  const [adminLists, setAdminLists] = useState([]);

  useEffect(() => {
    // Fetch admin-created lists when component mounts
    fetchAdminLists();
  }, []);

  const fetchAdminLists = async () => {
    try {
      const response = await axios.get('http://localhost:5432/adminLists');
      const { lists } = response.data;
      setAdminLists(lists);
    } catch (error) {
      console.error('Error fetching admin lists:', error);
    }
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Transform Your Shopping Experience</h1>
            <h2>Discover the Best Deals with Trolley Tracker</h2>
            <p>Compare prices, build personalized shopping lists, and unlock savings on your favorite products.</p>
            <div className="cta-buttons">
              <Link to="/faqs" className="cta-button">Learn More (FAQs)</Link>
              <Link to="/aboutus" className="cta-button">About Us</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={process.env.PUBLIC_URL + '/newtrolley.avif'} alt="Trolley" />
          </div>
        </div>
      </section>

      <section className="admin-lists">
        <h2>Popular Lists</h2>
        <div className="admin-list-container">
          {adminLists.map((list, index) => (
            <div className="admin-list-box" key={index}>
              <div className="admin-list-header">
                <h4 className="admin-list-name">{list.name}</h4>
              </div>
              <ul>
                {list.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="admin-item-name">{item.title}</span>
                    <span className="admin-item-price">£{item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="how-it-works">
        <h2>How Trolley Tracker Works</h2>
        <div className="step-container">
          {/* Add steps or illustrations of how the platform works */}
          <div className="step">
            <h3>Step 1: Compare Prices</h3>
            <p>Search for products and compare prices across multiple stores.</p>
          </div>
          <div className="step">
            <h3>Step 2: Create Shopping Lists</h3>
            <p>Organize your purchases into lists for easier shopping.</p>
          </div>
          <div className="step">
            <h3>Step 3: Find the Best Deals</h3>
            <p>Discover the cheapest options for your favorite products.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-container">
          {/* Add user testimonials here */}
          <div className="testimonial">
            <blockquote>"Trolley Tracker helped me save money on groceries! Highly recommended."</blockquote>
            <p>- Jane Doe</p>
          </div>
          <div className="testimonial">
            <blockquote>"Amazing platform for budget-conscious shoppers."</blockquote>
            <p>- John Smith</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
        
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









