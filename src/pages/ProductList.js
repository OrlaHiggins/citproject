import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5432/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        setError("Failed to fetch products");
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    const formattedPrice = price.toFixed(2); // Convert to a string with two decimal places
    return `£${formattedPrice}`; // Add the pound symbol and return the formatted price
  };

  return (
    <div className="productListContainer">
      <div className="searchInputContainer">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="searchInput"
        />
      </div>
      {error && <p>{error}</p>}
      <div className="productListGrid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="productCard">
            <Link to={`/products/${product._id}`}>
              <div className="productImageContainer">
                <img
                  src={`http://localhost:5432/${product.imageUrls[0]}`}
                  alt={product.product}
                  className="productImage"
                />
              </div>
            </Link>
            <div className="productText">
              <h3>{product.product}</h3>
              <h3>{formatPrice(product.price)}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
