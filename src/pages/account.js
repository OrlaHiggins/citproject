import React, { useState, useEffect } from "react";
import './Account.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';

function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, []);

    return authenticated;
}

function Account() {
    const [userData, setUserData] = useState(null);
    const [newListName, setNewListName] = useState(""); // New state for storing the name of the new list
    const [newItemTitle, setNewItemTitle] = useState(""); // New state for storing the title of a new item
    const [userLists, setUserLists] = useState([]); // New state for storing user's lists
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false); // New state for controlling the popup visibility
    const authenticated = useAuth();
    const [selectedItems, setSelectedItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        // Fetch user data and lists when component mounts
        if (authenticated) {
            fetchUserData();
            fetchUserLists();
            fetchProducts();
        }
    }, [authenticated]);

    const fetchUserData = () => {
        // Fetch user data from the server
        fetch("http://localhost:5432/userData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data, "userData");
            if (data.status === "ok") {
                setUserData(data.data);
            } else {
                console.error("Server returned an error:", data.error);
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
    };

      const fetchUserLists = async () => {
        try {
          const token = window.localStorage.getItem("token"); // Get the token from localStorage
      
          const response = await axios.get(`http://localhost:5432/userLists?token=${token}`);
          const { lists } = response.data;
      
          setUserLists(lists);
        } catch (error) {
          console.error('Error fetching user lists:', error);
        }
      };

    // const handleLogout = () => {
    //     // Perform logout actions
    //     window.localStorage.removeItem("token");
    //     navigate('/login');
    // };

    // const handleSignIn = () => {
    //     navigate('/login'); // Navigate to the "/login" page
    // };

    const handleAddList = () => {
        setShowPopup(true); // Show the popup when "Create New List" is clicked
    };

    const [itemList, setItemList] = useState([]);

    const handleAddItem = () => {
        if (newItemTitle) {
            setItemList(prevItems => [...prevItems, { title: newItemTitle }]);
            setNewItemTitle("");
        }
    };

    const fetchProducts = () => {
        fetch('http://localhost:5432/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    };

    const handleProductSelect = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedProducts(selectedOptions);
      };
    
      const handleConfirm = async () => {
        setShowPopup(false);
        if (newListName && selectedProducts.length > 0) {
          try {
            const token = window.localStorage.getItem("token");
      
            // Fetch the selected product objects from the database
            const selectedProductObjects = await Promise.all(
              selectedProducts.map(async (productId) => {
                const response = await axios.get(`http://localhost:5432/products/${productId}`);
                return response.data;
              })
            );
      
            const response = await axios.post('http://localhost:5432/createList', {
              token,
              listName: newListName,
              products: selectedProductObjects,
            });
      
            console.log('List created:', response.data);
      
            // Fetch user lists after creating a new list
            fetchUserLists();
      
            // Clear the selected products and list name after creating the list
            setSelectedProducts([]);
            setNewListName("");
          } catch (error) {
            console.error('Error creating list:', error);
          }
        }
      };
      const handleCreateList = async (token, items) => {
        try {
          const response = await axios.post('http://localhost:5432/createList', {
            token,
            listName: 'My Shopping List',
            items,
          });
          console.log('Shopping list created:', response.data);
          fetchUserLists();
          setSelectedItems([]); // Clear the selected items after creating the list
        } catch (error) {
          console.error('Error creating shopping list:', error);
        }
      };
    
    const handleCancel = () => {
        // Close the popup without creating the new list
        setShowPopup(false);
    };
    

    const handleDeleteItem = (listName, itemIndex) => {
        // Delete an item from the list of items
        setUserLists(prevLists => {
            const updatedLists = [...prevLists];
            const listIndex = updatedLists.findIndex(list => list.name === listName);
            if (listIndex !== -1) {
                updatedLists[listIndex].items.splice(itemIndex, 1);
            }
            return updatedLists;
        });
    };

    const handleEditItem = (listName, itemIndex, newTitle) => {
        // Edit an item in the list of items
        setUserLists(prevLists => {
            const updatedLists = [...prevLists];
            const listIndex = updatedLists.findIndex(list => list.name === listName);
            if (listIndex !== -1) {
                updatedLists[listIndex].items[itemIndex].title = newTitle;
            }
            return updatedLists;
        });
    };

    const productsByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});


    return (
        <div>
            {!authenticated && (
                <section className="account-details">
                    <div>
                        <p>You are not signed in. Please login to view your account.</p>
                        {/* <button onClick={handleSignIn}>Login</button> */}
                    </div>
                </section>
            )}

            {authenticated && (
                <section className="account-details">
                    <div>
                        <h2>Welcome back {userData?.fname}!</h2>
                        {/* <button onClick={handleLogout}>Logout</button> */}
                    </div>
                </section>
            )}

{authenticated && (
  <section className="your-lists">
    <h3>Your Lists</h3>
    <div className="folders-grid">
      {/* Add your "Create New List" box here */}
      <div className="new-list-box" onClick={handleAddList}>
        <p>Create New List</p>
        <img src="pluscircle.jpeg" alt="Plus Circle" />
      </div>

      {/* Display user's existing lists here */}
      {userLists.length > 0 && userLists.map((list, index) => (
        <div className="list-box" key={index}>
          <Link to={`/lists/${list._id}`}>
            <h4>{list.name}</h4>
          </Link>
          {/* Add functionality to edit and delete items */}
          <ul>
            {list.items && list.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
)}

{showPopup && (
  <div className="popup-container">
    <div className="popup">
      <h3>Enter List Name</h3>
      <input
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="Enter list name"
      />
      <h3>Select Products</h3>
      {Object.entries(productsByCategory).map(([category, products]) => (
        <div key={category}>
          {/* <h4>{category}</h4> */}
          {products.map((product) => (
            <div key={product._id}>
              <label>
                <input
                  type="checkbox"
                  value={product._id}
                  checked={selectedProducts.includes(product._id)}
                  onChange={(e) => {
                    const productId = e.target.value;
                    if (e.target.checked) {
                      setSelectedProducts([...selectedProducts, productId]);
                    } else {
                      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
                    }
                  }}
                />
                {product.product}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  </div>
)}
        </div>
    );
}

export default Account;






