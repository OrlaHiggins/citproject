import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListPopup.css";

const ListPopup = ({ productId, onClose }) => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    // Fetch the user's lists from the server
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5432/userLists", {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
        });
        setLists(response.data.lists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, []);

  const handleListSelect = async (listId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5432/lists/${listId}/add-product`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose();
    } catch (error) {
      console.error("Error adding product to list:", error);
    }
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <h3>Select a list to add the product:</h3>
        <div className="list-grid">
          {lists.map((list) => (
            <div
              className="list-box"
              key={list._id}
              onClick={() => handleListSelect(list._id)}
            >
              <h4>{list.name}</h4>
              <ul>
                {list.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ListPopup;
