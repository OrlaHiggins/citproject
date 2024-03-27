import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminProductList.css'; // Import the CSS file

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    product: '',
    category: '',
    price: '',
    description: '',
  });


  useEffect(() => {
    const fetchUserData = async () => {
      const token = window.localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5432/userData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (
            data.status === 'ok' &&
            data.data.userType &&
            data.data.userType.toLowerCase() === 'admin'
          ) {
            setIsAdmin(true);
            fetchProducts(); // Call fetchProducts if the user is an admin
          } else {
            setIsAdmin(false);
            // Redirect to the login page or display an error message
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          // Handle error
        }
      } else {
        setIsAdmin(false);
        // Redirect to the login page or display an error message
      }

      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5432/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing. Redirecting to login page.');
        // Redirect to the login page or display an error message
        return;
      }

      console.log('Deleting product with ID:', productId);

      // Make the DELETE request to the backend endpoint
      const response = await axios.delete(`http://localhost:5432/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      // Handle error
    }
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    setEditProductId(productId);
    setEditedProduct({
      product: productToEdit.product,
      category: productToEdit.category,
      price: productToEdit.price,
      description: productToEdit.description,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveProduct = async () => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing. Redirecting to login page.');
        // Redirect to the login page or display an error message
        return;
      }

      const response = await axios.put(
        `http://localhost:5432/products/${editProductId}`,
        editedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // Update the product in the state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editProductId ? { ...product, ...editedProduct } : product
        )
      );

      setEditProductId(null);
      setEditedProduct({
        product: '',
        category: '',
        price: '',
        description: '',
      });
    } catch (err) {
      console.error('Error updating product:', err);
      // Handle error
    }
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
    setEditedProduct({
      product: '',
      category: '',
      price: '',
      description: '',
    });
  };

  return (
    <div className="templateContainer">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isAdmin ? (
            <>
              <div className="searchInput_Container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="searchInput"
                />
              </div>
              {error && <p>{error}</p>}
              <div className="template_Container">
                <table>
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((product) =>
                        product.product.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((product) => (
                        <tr key={product._id}>
                          <td>
                            <img
                              src={`http://localhost:5432/${product.imageUrls[0]}`}
                              alt={product.product}
                              className="product-image"
                            />
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <input
                                type="text"
                                name="product"
                                value={editedProduct.product}
                                onChange={handleInputChange}
                              />
                            ) : (
                              product.product
                            )}
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <input
                                type="text"
                                name="category"
                                value={editedProduct.category}
                                onChange={handleInputChange}
                              />
                            ) : (
                              product.category
                            )}
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <input
                                type="text"
                                name="price"
                                value={editedProduct.price}
                                onChange={handleInputChange}
                              />
                            ) : (
                              product.price
                            )}
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <textarea
                                name="description"
                                value={editedProduct.description}
                                onChange={handleInputChange}
                              ></textarea>
                            ) : (
                              product.description
                            )}
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <div className="buttons">
                                <button onClick={handleSaveProduct}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                              </div>
                            ) : (
                              <div className="buttons">
                                <button
                                  className="edit-button"
                                  onClick={() => handleEditProduct(product._id)}
                                >
                                  Update
                                </button>
                                <button
                                  className="delete-button"
                                  onClick={() => handleDeleteProduct(product._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <p>You are not authorized to access this page.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
  }
  
  export default AdminProductList;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './AdminProductList.css'; // Import the CSS file

// function AdminProductList() {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = window.localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await fetch('http://localhost:5432/userData', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ token }),
//           });

//           const data = await response.json();

//           if (
//             data.status === 'ok' &&
//             data.data.userType &&
//             data.data.userType.toLowerCase() === 'admin'
//           ) {
//             setIsAdmin(true);
//             fetchProducts(); // Call fetchProducts if the user is an admin
//           } else {
//             setIsAdmin(false);
//             // Redirect to the login page or display an error message
//           }
//         } catch (error) {
//           console.error('Error during fetch:', error);
//           // Handle error
//         }
//       } else {
//         setIsAdmin(false);
//         // Redirect to the login page or display an error message
//       }

//       setIsLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get('http://localhost:5432/products');
//       setProducts(response.data);
//     } catch (error) {
//       setError('Failed to fetch products');
//       console.error('Error fetching products:', error);
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     try {
//       const token = window.localStorage.getItem('token');
//       if (!token) {
//         console.error('Token is missing. Redirecting to login page.');
//         // Redirect to the login page or display an error message
//         return;
//       }

//       console.log('Deleting product with ID:', productId);

//       // Make the DELETE request to the backend endpoint
//       const response = await axios.delete(`http://localhost:5432/products/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log(response.data);

//       // Remove the deleted product from the state
//       setProducts(products.filter((product) => product._id !== productId));
//     } catch (err) {
//       console.error('Error deleting product:', err);
//       // Handle error
//     }
//   };

//   const handleEditProduct = async (productId) => {
//     try {
//       // Redirect to the edit product page with the productId
//       window.location.href = `/edit-product/${productId}`;
//     } catch (error) {
//       console.error('Error editing product:', error);
//       // Handle error
//     }
//   };

//   return (
//     <div className="templateContainer">
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           {isAdmin ? (
//             <>
//               <div className="searchInput_Container">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   id="searchInput"
//                 />
//               </div>
//               {error && <p>{error}</p>}
//               <div className="template_Container">
//                 {products
//                   .filter((product) =>
//                     product.product.toLowerCase().includes(searchTerm.toLowerCase())
//                   )
//                   .map((product) => (
//                     <div key={product._id} className="product-container">
//                       <div className="product-image">
//                         {product.imageUrls.map((imageUrl, index) => (
//                           <Link key={index} to={`/products/${product._id}`}>
//                             <img
//                               src={`http://localhost:5432/${imageUrl}`}
//                               alt={`Product ${index}`}
//                               style={{ width: '100%', height: 'auto' }}
//                             />
//                           </Link>
//                         ))}
//                       </div>
//                       <div className="product-text">
//   <h3>{product.product}</h3>
//   <div className="buttons">
//     <button className="delete-button" onClick={(e) => handleDeleteProduct(product._id)}>Delete</button>
//     {/* <button className="edit-button" onClick={(e) => handleEditProduct(product._id)}>Edit</button> */}
//   </div>
// </div>



//                     </div>
//                   ))}
//               </div>
//             </>
//           ) : (
//             <div>
//               <p>You are not authorized to access this page.</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default AdminProductList;
