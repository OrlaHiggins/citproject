import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react';

function EditList({ match }) {
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  // Define productId within the component
  const productId = match.params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5432/products/${productId}`);
        const { product, description, category } = response.data;
        setProduct(product);
        setDescription(description);
        setCategory(category);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = { product, description, category };
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `http://localhost:5432/products/${productId}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response.data);
      history.push('/admin-product-list');
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="product">Product Name:</label>
          <input
            type="text"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Product</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default EditList;

