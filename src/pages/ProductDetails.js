import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

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

  return (
    <div className="product-details-container">
      <div className="product-details-image-container">
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
        <h1>{product.product}</h1>
        <p>Description: {product.description}</p>
        <p>Price: £{product.price}</p>
        <p>Category: {product.category}</p>
        {isAdmin ? (
          <button className="update-product-btn">Update Product</button>
        ) : (
          <button className="add-to-cart-btn">Add to list</button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

