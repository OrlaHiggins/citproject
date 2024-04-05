import React from 'react';
import './FAQs.css';

const FAQs = () => {
  return (
    <div className="faqs-container">
      <h1>Trolley Tracker FAQs</h1>

      <div className="faq-item">
        <h2>What is Trolley Tracker?</h2>
        <p>
          Trolley Tracker is a user-friendly platform that helps you keep track of your shopping carts, ensuring they are always where you need them. Our mission is to enhance the efficiency of your grocery shopping experience.
        </p>
      </div>

      <div className="faq-item">
        <h2>How does Trolley Tracker work?</h2>
        <p>
          Trolley Tracker allows you to create and manage your shopping lists. You can select products from various categories, and the platform will automatically generate a list with the most affordable options. The total cost of your list is calculated and displayed for your convenience.
        </p>
      </div>

      <div className="faq-item">
        <h2>Who can use Trolley Tracker?</h2>
        <p>
          Trolley Tracker is available for both regular users and admin users. Regular users can create and manage their shopping lists, while admin users have additional capabilities, such as adding new products, editing existing items, and managing user accounts.
        </p>
      </div>

      <div className="faq-item">
        <h2>What are the benefits of using Trolley Tracker?</h2>
        <ul>
          <li>Streamlined shopping experience: Trolley Tracker helps you stay organized and efficient by providing a centralized platform to manage your shopping lists.</li>
          <li>Cost-saving features: The platform automatically selects the most affordable products for your list, helping you save money on your purchases.</li>
          <li>Convenient accessibility: Trolley Tracker can be accessed from any device, allowing you to manage your lists on the go.</li>
          <li>Personalized experience: The platform remembers your preferences and shopping patterns, making it easier to create and manage your lists over time.</li>
        </ul>
      </div>

      <div className="faq-item">
        <h2>How do I create an account on Trolley Tracker?</h2>
        <p>
          To create an account on Trolley Tracker, simply visit the sign-up page and provide the required information, such as your name, email address, and password. Once your account is created, you can log in and start using the platform.
        </p>
      </div>

      <div className="faq-item">
        <h2>Can I share my shopping lists with others?</h2>
        <p>
          Yes, Trolley Tracker allows you to share your shopping lists with others, making it easier to collaborate on grocery shopping or household tasks.
        </p>
      </div>

      <div className="faq-item">
        <h2>How do I add or remove items from my shopping list?</h2>
        <p>
          To add items to your shopping list, simply click on the "Create New List" button and select the products you need. You can also search for specific items or browse by category. To remove an item, locate it in your list and click the "Delete" button.
        </p>
      </div>

      <div className="faq-item">
        <h2>What if I have a question or need assistance?</h2>
        <p>
          If you have any questions or need assistance with Trolley Tracker, please don't hesitate to contact our customer support team. You can reach us by email at support@trolleytracker.com or by phone at 1-800-123-4567. Our team is dedicated to providing prompt and helpful responses to all your inquiries.
        </p>
      </div>
    </div>
  );
};

export default FAQs;