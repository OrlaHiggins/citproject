import React from "react";
import "./AboutUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUsers,
  faPiggyBank,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Back button */}
      <div className="back-button">
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>
      </div>

      {/* About Us header */}
      <section className="about-us-header">
        <h1>About Trolley Tracker</h1>
      </section>

      {/* About Us content */}
      <section className="about-us-content">
        {/* Mission section */}
        <div className="about-us-section">
          <FontAwesomeIcon icon={faShoppingCart} className="about-us-icon" />
          <h2>Our Mission</h2>
          <p>
            At Trolley Tracker, our mission is to simplify your grocery
            shopping experience. We understand the challenges of fluctuating
            prices and the desire to find the best deals. That's why we created
            a platform that helps you track and compare prices across different
            stores, so you can make informed decisions and save money on your
            purchases.
          </p>
        </div>

        {/* User-centric approach section */}
        <div className="about-us-section">
          <FontAwesomeIcon icon={faUsers} className="about-us-icon" />
          <h2>User-Centric Approach</h2>
          <p>
            We put our users at the heart of everything we do. Our team is
            dedicated to creating a seamless and intuitive user experience. We
            listen to your feedback and continuously improve our platform to
            meet your needs. Whether you're a savvy shopper or new to price
            tracking, Trolley Tracker is designed to be accessible and
            user-friendly for everyone.
          </p>
        </div>

        {/* Save time and money section */}
        <div className="about-us-section">
          <FontAwesomeIcon icon={faPiggyBank} className="about-us-icon" />
          <h2>Save Time and Money</h2>
          <p>
            With Trolley Tracker, you can save both time and money on your
            grocery shopping. Our platform allows you to create personalized
            shopping lists and provides you with the most cost-effective options
            for each item. By comparing prices across multiple stores, you can
            ensure that you're getting the best deals available. Say goodbye to
            overspending and hello to smart shopping with Trolley Tracker.
          </p>
        </div>
      </section>

      {/* Call-to-action section */}
      <section className="about-us-cta">
        <h2>Join the Trolley Tracker Community</h2>
        <p>
          Ready to revolutionize your grocery shopping experience?{" "}
          <a href="/signup" className="about-us-cta-link">
            Sign up here
          </a>{" "}
          and start tracking prices like a pro!
        </p>
      </section>
    </div>
  );
};

export default AboutUs;