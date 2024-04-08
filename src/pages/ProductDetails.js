import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './ProductDetails.css';
import ListPopup from './ListPopup';


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  const [showListPopup, setShowListPopup] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  

  useEffect(() => {
    axios
      .get(`http://localhost:5432/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        setError('Failed to fetch product details');
        console.error('Error fetching product details:', error);
      });

    // Check if user is admin
    const token = localStorage.getItem('token');
    setIsSignedIn(!!token);
    if (token) {
      // Make a request to the backend to verify user's admin status
      axios.post('http://localhost:5432/userData', { token })
        .then(response => {
          if (response.data.status === 'ok' && response.data.data.userType === 'Admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
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


  return (
    <div className="product-details-container">
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
        <p>Price: £{product.price}</p>
        {/* <p>Category: {product.category}</p> */}
        {product.websiteLink && (
          <div>
            <h3>Where to buy:</h3>
            <a href={product.websiteLink} target="_blank" rel="noopener noreferrer">
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
            <button className="add-to-cart-btn" onClick={handleAddToList}>
              Add to list
            </button>
            {showMessage && (
              <p className="sign-in-message">You must sign in to upload this products to your list</p>
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

