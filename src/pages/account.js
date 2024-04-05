import React, { useState, useEffect } from "react";
import './Account.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';


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
    const [newListName, setNewListName] = useState("");
    const [newItemTitle, setNewItemTitle] = useState("");
    const [userLists, setUserLists] = useState([]);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const authenticated = useAuth();
    const [selectedItems, setSelectedItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    

    useEffect(() => {
        // Fetch user data and lists when component mounts
        if (authenticated) {
            fetchUserData();
            fetchUserLists();
            fetchProducts();
            fetchCategories();
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

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
      if (date >= oneWeekAgo) {
        return "This Week";
      } else {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
      }
    };
    const fetchUserLists = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        const response = await axios.get("http://localhost:5432/userLists", config);
        const { lists } = response.data;
    
        setUserLists(lists);
      } catch (error) {
        console.error("Error fetching user lists:", error);
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

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5432/categories');
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const handleProductSelect = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedProducts(selectedOptions);
      };
    
      // Update the handleConfirm function
      const handleConfirm = async () => {
        setShowPopup(false);
        if (newListName && selectedCategories.length > 0) {
          try {
            const token = window.localStorage.getItem("token");
            const response = await axios.post('http://localhost:5432/createList', {
              token,
              listName: newListName,
              categories: selectedCategories,
            });
            console.log('List created:', response.data);
            fetchUserLists();
            setSelectedCategories([]);
            setNewListName("");
          } catch (error) {
            console.error('Error creating list:', error);
          }
        } else {
          console.error('List name or selected categories missing');
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
// Add a new function to handle deleting a list
const handleDeleteList = async (listId) => {
    try {
      console.log('Deleting list with ID:', listId); // Log the listId
  
      const token = window.localStorage.getItem("token");
      await axios.delete(`http://localhost:5432/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUserLists();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

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
    <h3>My Lists</h3>
    <div className="folders-grid">
      {/* Add your "Create New List" box here */}
      <div className="new-list-box" onClick={handleAddList}>
        <p>Create New List</p>
        <FontAwesomeIcon icon={faCirclePlus} className="plus-icon" />
      </div>
      {userLists.length > 0 && userLists.map((list, index) => (
  <div className="list-box" key={index}>
    <div className="list-header">
      <h4 className="list-name">
        <Link to={`/lists/${list._id}`} className="list-link">
          {list.name}
        </Link>
      </h4>
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="delete-icon"
        onClick={() => handleDeleteList(list._id)}
      />
    </div>
    <ul>
      {list.items && list.items.length > 0 && list.items.map((item, itemIndex) => (
        <li key={itemIndex}>
          <FontAwesomeIcon icon={faMinus} className="bullet-icon" />
          {item.title}
        </li>
      ))}
    </ul>
    {list.totalPrice !== undefined && (
      <p>Total Price: £{list.totalPrice.toFixed(2)}</p>
    )}
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
<h3>Select Categories</h3>
{categories.map((category) => (
  <div key={category}>
    <label>
      <input
        type="checkbox"
        value={category}
        checked={selectedCategories.includes(category)}
        onChange={(e) => {
          const categoryName = e.target.value;
          if (e.target.checked) {
            setSelectedCategories([...selectedCategories, categoryName]);
          } else {
            setSelectedCategories(selectedCategories.filter((c) => c !== categoryName));
          }
        }}
      />
      {category}
    </label>
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




