import React from "react";
import "./Footer.css"; // Import your CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            {/* Use a div or directly put content in the footer */}
            <div className="footer-content">
                <p>&copy; 2024 Trolley Tracker. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

