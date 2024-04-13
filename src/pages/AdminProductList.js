import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminProductList.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    product: "",
    category: "",
    price: "",
    description: "",
    websiteLink: "", // Include the websiteLink field
    imageUrls: [],
    storeId: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5432/userData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (
            data.status === "ok" &&
            data.data.userType &&
            data.data.userType.toLowerCase() === "admin"
          ) {
            setIsAdmin(true);
            fetchProducts(); // Call fetchProducts if the user is an admin
          } else {
            setIsAdmin(false);
            // Redirect to the login page or display an error message
          }
        } catch (error) {
          console.error("Error during fetch:", error);
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
      const response = await axios.get("http://localhost:5432/products");
      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing. Redirecting to login page.");
        // Redirect to the login page or display an error message
        return;
      }

      console.log("Deleting product with ID:", productId);

      // Make the DELETE request to the backend endpoint
      const response = await axios.delete(
        `http://localhost:5432/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
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
      websiteLink: productToEdit.websiteLink,
      imageUrls: productToEdit.imageUrls,
      storeId: productToEdit.storeId,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setEditedProduct((prevState) => ({
      ...prevState,
      imageUrls: Array.from(e.target.files),
    }));
  };

  const handleSaveProduct = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing. Redirecting to login page.");
        // Redirect to the login page or display an error message
        return;
      }

      const formData = new FormData();
      formData.append("product", editedProduct.product);
      formData.append("storeId", editedProduct.storeId);
      formData.append("description", editedProduct.description);
      formData.append("category", editedProduct.category);
      formData.append("price", editedProduct.price);
      formData.append("websiteLink", editedProduct.websiteLink);

      // Append the image files individually
      editedProduct.imageUrls.forEach((image) => {
        if (typeof image === "object") {
          formData.append("productImages", image);
        }
      });

      const response = await axios.put(
        `http://localhost:5432/products/${editProductId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Fetch the updated product data from the server
      const updatedProduct = response.data;

      // Update the products state with the updated product data
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editProductId ? updatedProduct : product
        )
      );

      setEditProductId(null);
      setEditedProduct({
        product: "",
        category: "",
        price: "",
        description: "",
        websiteLink: "",
        imageUrls: [],
        storeId: "",
      });
    } catch (err) {
      console.error("Error updating product:", err);
      // Handle error
    }
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
    setEditedProduct({
      product: "",
      category: "",
      price: "",
      description: "",
      websiteLink: "", // Reset the websiteLink field
      imageUrls: [], // Reset the imageUrls field
      storeId: "",
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
                      <th>Store</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Links</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(
                        (product) =>
                          typeof product.product === "string" &&
                          product.product
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                      .map((product) => (
                        <tr key={product._id}>
                          <td>
                            {editProductId === product._id ? (
                              <>
                                <input
                                  type="file"
                                  name="productImages"
                                  multiple
                                  onChange={handleImageChange}
                                />
                                {editedProduct.imageUrls.length > 0 &&
                                  typeof editedProduct.imageUrls[0] ===
                                    "object" && (
                                    <img
                                      src={URL.createObjectURL(
                                        editedProduct.imageUrls[0]
                                      )}
                                      alt="Preview"
                                      className="product-image"
                                    />
                                  )}
                              </>
                            ) : (
                              <img
                                src={`http://localhost:5432/${product.imageUrls[0]}`}
                                alt={product.product}
                                className="product-image"
                              />
                            )}
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <input
                                type="text"
                                name="storeId"
                                value={editedProduct.storeId}
                                onChange={handleInputChange}
                              />
                            ) : (
                              product.storeId
                            )}
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
                              <input
                                type="text"
                                name="websiteLink"
                                value={editedProduct.websiteLink}
                                onChange={handleInputChange}
                              />
                            ) : (
                              <p>{product.websiteLink || "N/A"}</p>
                            )}
                          </td>
                          <td>
                            {editProductId === product._id ? (
                              <div className="buttons">
                                <button onClick={handleSaveProduct}>
                                  Save
                                </button>
                                <button onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="buttons">
                                <button
                                  className="edit-button"
                                  onClick={() => handleEditProduct(product._id)}
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                                <button
                                  className="delete-button"
                                  onClick={() =>
                                    handleDeleteProduct(product._id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
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
