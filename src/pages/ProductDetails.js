import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ListPopup from "./ListPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5432/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        setError("Failed to fetch product details");
        console.error("Error fetching product details:", error);
      });

    const token = localStorage.getItem("token");
    setIsSignedIn(!!token);

    if (token) {
      axios
        .post("http://localhost:5432/userData", { token })
        .then((response) => {
          if (
            response.data.status === "ok" &&
            response.data.data.userType === "Admin"
          ) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsAdmin(false);
        });
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  const handleAddToList = () => {
    if (isSignedIn) {
      setShowListPopup(true);
    } else {
      setShowMessage(true);
    }
  };

  const handleCloseListPopup = () => {
    setShowListPopup(false);
  };

  const formatPrice = (price) => {
    const formattedPrice = price.toFixed(2); // Convert to a string with two decimal places
    return `£${formattedPrice}`; // Add the pound symbol and return the formatted price
  };

  return (
    <div className="product-details-container">
      <div className="back-arrow">
        <Link to="/product-list">
          <FontAwesomeIcon icon={faReply} />
        </Link>
      </div>
      <div className="product-details-image-container">
        <h1>{product.product}</h1>
        {product.imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={`http://localhost:5432/${imageUrl}`}
            alt={`Product ${index}`}
            className="product-details-image"
          />
        ))}
      </div>
      <div className="product-details-info">
        <p>{product.description}</p>
        <p>Price: {formatPrice(product.price)}</p>
        {product.websiteLink && (
          <div className="product-details-website">
            <h3>Where to buy:</h3>
            <a
              href={product.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </div>
        )}
        {isAdmin ? (
          <Link to="/admin/products">
            <button className="update-product-btn">Update Product</button>
          </Link>
        ) : (
          <div>
            <button className="add-to-list-btn" onClick={handleAddToList}>
              Add to List
            </button>
            {showMessage && (
              <p className="sign-in-message">
                You must{" "}
                <a href="/login" className="about-us-cta-link">
                  {" "}
                  sign in{" "}
                </a>{" "}
                to add this product to your list
              </p>
            )}
          </div>
        )}
      </div>
      {showListPopup && (
        <ListPopup productId={product._id} onClose={handleCloseListPopup} />
      )}
    </div>
  );
};

export default ProductDetails;
