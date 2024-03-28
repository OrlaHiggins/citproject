import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ListDetails.css';

const ListDetails = () => {
  const { listId } = useParams();
  const [listDetails, setListDetails] = useState(null);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [editedList, setEditedList] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const token = window.localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5432/lists/${listId}?token=${token}`);
        const listData = response.data;
        console.log('Received list data:', listData); // Log the received data

        if (response.status === 200) {
          setListDetails(listData);
          setEditedList(listData); // Set the initial editedList to the fetched listData
        } else if (response.status === 403) {
          setError('Access denied. You do not have permission to access this list.');
        } else {
          setError('Failed to fetch list details');
          console.error('Error fetching list details:', response.data.error);
        }
      } catch (error) {
        // ... (existing error handling code)
      }
    };

    fetchListDetails();
  }, [listId]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (listDetails) {
        const productIds = listDetails.items.map(item => item.productId);
        const productDetailsPromises = productIds.map(async productId => {
          const response = await axios.get(`http://localhost:5432/products/${productId}`);
          return response.data;
        });
        const fetchedProductDetails = await Promise.all(productDetailsPromises);
        const productDetailsMap = fetchedProductDetails.reduce((acc, product, index) => {
          acc[productIds[index]] = product;
          return acc;
        }, {});
        setProductDetails(productDetailsMap);
      }
    };

    fetchProductDetails();
  }, [listDetails]);

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5432/products');
        setAvailableProducts(response.data);
      } catch (error) {
        console.error('Error fetching available products:', error);
      }
    };

    fetchAvailableProducts();
  }, []);

  const handleDeleteListItem = (itemIndex) => {
    const updatedList = { ...editedList };
    updatedList.items.splice(itemIndex, 1);
    setEditedList(updatedList);
  };

  const handleAddItem = (productId) => {
    const product = availableProducts.find(p => p._id === productId);

    if (product) {
      const newItem = { title: product.product, productId: product._id };
      const updatedList = { ...editedList };
      updatedList.items.push(newItem);
      setEditedList(updatedList);
    } else {
      console.error(`Product with ID ${productId} not found in the database.`);
    }
  };

  const handleUpdateList = async () => {
    try {
      const token = window.localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5432/lists/${listId}`, editedList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('List updated successfully:', response.data);
      setListDetails(response.data.updatedList); // Update the listDetails state with the updated list
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  useEffect(() => {
    if (editedList && editedList !== listDetails) {
      handleUpdateList();
    }
  }, [editedList, listDetails, handleUpdateList]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!listDetails) {
    return <p>Loading...</p>;
  }

  console.log('listDetails:', listDetails); // Log the listDetails object

  return (
    <div className="list-details-container">
      <h1>{listDetails.name}</h1>
      <div className="template-container">
        {editedList.items.map((item, index) => {
          const product = productDetails[item.productId] || null;
          console.log(`Item ${index}:`, item); // Log each item
          console.log(`Item ${index} product details:`, product); // Log the product details for each item

          return (
            <div className="product-container">
            <div className="product-image">
              {product ? (
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={`http://localhost:5432/${product.imageUrls[0]}`}
                    alt={product.product}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Link>
              ) : (
                <p>Product not found</p>
              )}
            </div>
            <div className="product-text">
              {product ? (
                <>
                  <h3>{product.product}</h3>
                  {/* <p>{product.description}</p> */}
                  <p>Price: £{product.price}</p>
                </>
              ) : item.productId === null ? (
                <p>{item.title}</p>
              ) : (
                <p>Product not found</p>
              )}
            </div>
            <div className="product-actions">
              {/* <button onClick={() => handleDeleteListItem(index)}>Delete Item</button> */}
              <button onClick={() => setShowEditModal(true)}>Edit</button>
            </div>
          </div>
          );
        })}
      </div>
      {showEditModal && (
  <div className="edit-modal">
    <div className="edit-modal-content">
      <h2>Edit List</h2>
      <ul>
        {editedList.items.map((item, index) => (
          <li key={index}>
            {item.title}
            <button onClick={() => handleDeleteListItem(index)}>X</button>
          </li>
        ))}
      </ul>
      <div className="add-item-container">
        <select onChange={(e) => handleAddItem(e.target.value)}>
          <option value="">Select a product to add</option>
          {availableProducts
            .filter(product => !editedList.items.some(item => item.productId === product._id))
            .map(product => (
              <option key={product._id} value={product._id}>
                {product.product}
              </option>
            ))}
        </select>
      </div>
      <button onClick={() => setShowEditModal(false)}>Done</button>
    </div>
  </div>
)}
    </div>
  );
};

export default ListDetails;