import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const Homepage = () => {
  const [adminLists, setAdminLists] = useState([]);

  useEffect(() => {
    // Fetch admin-created lists when component mounts
    fetchAdminLists();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "filled" : "empty"}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  const fetchAdminLists = async () => {
    try {
      const response = await axios.get("http://localhost:5432/adminLists");
      const { lists } = response.data;
      setAdminLists(lists);
    } catch (error) {
      console.error("Error fetching admin lists:", error);
    }
  };
  const steps = document.querySelectorAll(".step");

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      step.classList.toggle("flipped");
    });
  });

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Transform Your Shopping Experience</h1>
            <h2>Discover the Best Deals with Trolley Tracker</h2>
            <p>
              Compare prices, build personalized shopping lists, and unlock
              savings on your favorite products.
            </p>
            <div className="cta-buttons">
              <Link to="/faqs" className="cta-button">
                Learn More (FAQs)
              </Link>
              <Link to="/aboutus" className="cta-button">
                About Us
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img
              src={process.env.PUBLIC_URL + "/newtrolley.avif"}
              alt="Trolley"
            />
          </div>
        </div>
      </section>

      {/* <section className="admin-lists">
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
      </section> */}
      <section className="how-it-works">
        <h2>How Trolley Tracker Works</h2>
        <div className="step-container">
          <div className="step">
            <div className="step-front">
              <h3>Step 1</h3>
            </div>
            <div className="step-back">
              <h3>Compare Prices</h3>
              <p>
                Search for products and compare prices across multiple stores.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-front">
              <h3>Step 2</h3>
            </div>
            <div className="step-back">
              <h3>Create Shopping Lists</h3>
              <p>Organize your purchases into lists for easier shopping.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-front">
              <h3>Step 3</h3>
            </div>
            <div className="step-back">
              <h3>Find the Best Deals</h3>
              <p>Discover the cheapest options for your favorite products.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-container">
          {/* Add user testimonials here */}
          <div className="testimonial">
            <blockquote>
              "Trolley Tracker helped me save money on groceries! Highly
              recommended."
            </blockquote>
            <p>- John Higgins</p>
            <div className="rating">{renderStars(5)}</div>
          </div>
          <div className="testimonial">
            <blockquote>
              "As a student I found Trolley tracker to be an amazing platform
              for budget-conscious shoppers."
            </blockquote>
            <p>- Sam Graham</p>
            <div className="rating">{renderStars(5)}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
