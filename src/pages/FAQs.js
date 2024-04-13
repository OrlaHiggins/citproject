import React, { useState } from "react";
import "./FAQs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faList,
  faMobileAlt,
  faUserCog,
  faPlus,
  faMinus,
  faQuestionCircle,
  faChevronDown,
  faChevronUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const FAQs = () => {
  const [openFAQs, setOpenFAQs] = useState([]);

  const toggleFAQ = (index) => {
    if (openFAQs.includes(index)) {
      setOpenFAQs(openFAQs.filter((item) => item !== index));
    } else {
      setOpenFAQs([...openFAQs, index]);
    }
  };

  const faqData = [
    {
      question: "What is Trolley Tracker?",
      answer:
        "Trolley Tracker is a user-friendly platform that helps you keep track of your shopping carts, ensuring they are always where you need them. Our mission is to enhance the efficiency of your grocery shopping experience.",
      icon: faShoppingCart,
    },
    {
      question: "How does Trolley Tracker work?",
      answer:
        "Trolley Tracker allows you to create and manage your shopping lists. You can select products from various categories, and the platform will automatically generate a list with the most affordable options. The total cost of your list is calculated and displayed for your convenience.",
      icon: faList,
    },
    {
      question: "Who can use Trolley Tracker?",
      answer:
        "Trolley Tracker is available for both regular users and admin users. Regular users can create and manage their shopping lists, while admin users have additional capabilities, such as adding new products, editing existing items, and managing user accounts.",
      icon: faUserCog,
    },
    {
      question: "What are the benefits of using Trolley Tracker?",
      answer: `
        <ul>
          <li>Streamlined shopping experience: Trolley Tracker helps you stay organized and efficient by providing a centralized platform to manage your shopping lists.</li>
          <li>Cost-saving features: The platform automatically selects the most affordable products for your list, helping you save money on your purchases.</li>
          <li>Convenient accessibility: Trolley Tracker can be accessed from any device, allowing you to manage your lists on the go.</li>
          <li>Personalized experience: The platform remembers your preferences and shopping patterns, making it easier to create and manage your lists over time.</li>
        </ul>
      `,
      icon: faMobileAlt,
    },
    {
      question: "How do I create an account on Trolley Tracker?",
      answer:
        "To create an account on Trolley Tracker, simply visit the sign-up page and provide the required information, such as your name, email address, and password. Once your account is created, you can log in and start using the platform.",
      icon: faPlus,
    },
    {
      question: "How do I add or remove items from my shopping list?",
      answer:
        'To add items to your shopping list, simply click on the "Create New List" button and select the products you need. You can also search for specific items or browse by category. To remove an item, locate it in your list and click the "Delete" button.',
      icon: faMinus,
    },
    {
      question: "What if I have a question or need assistance?",
      answer:
        'If you have any questions or need assistance with Trolley Tracker, please don\'t hesitate to contact our customer support team. You can reach us by email at <a href="mailto:support@trolleytracker.com">support@trolleytracker.com</a> or by phone at <a href="tel:1-800-123-4567">1-800-123-4567</a>. Our team is dedicated to providing prompt and helpful responses to all your inquiries.',
      icon: faQuestionCircle,
    },
  ];

  return (
    <div className="faqs-container">
      <div className="back-button">
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </Link>
      </div>
      <h1 className="faqs-heading">Trolley Tracker FAQs</h1>
      <div className="faq-items">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <FontAwesomeIcon icon={faq.icon} className="faq-icon" />
              <h2>{faq.question}</h2>
              <FontAwesomeIcon
                icon={openFAQs.includes(index) ? faChevronUp : faChevronDown}
                className="faq-toggle-icon"
              />
            </div>
            {openFAQs.includes(index) && (
              <div
                className="faq-answer"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
