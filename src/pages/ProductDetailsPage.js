import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import data from "./GroceryData.json"; // Import your JSON data

function ProductDetailsPage() {
  const { productId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = () => {
      const selectedProduct = data.find((item) => item.id === parseInt(productId));
      setProduct(selectedProduct);
    };

    fetchProductData(); // Call the fetchProductData function

    if (product && category) {
      // Filter products with the same category
      const similar = data.filter((item) => item.category === category && item.id !== parseInt(productId));
      setSimilarProducts(similar);
    }
  }, [productId, product, category]);

  // Function to handle adding the product to the shopping list
  // Function to handle adding the product to the shopping list
const addToShoppingList = () => {
    // Generate a random product ID for testing
    const productId = Math.random().toString(36).substring(7);
    
    // Simulate adding the product to the shopping list
    console.log("Product added to shopping list with ID:", productId);
  };
  

  return (
    <div>
      {/* Display product details */}
      {product && (
        <div>
          <h2>{product.title}</h2>
          <img src={process.env.PUBLIC_URL + product.image} alt={product.title} />
          <p>Price: £{product.price.toFixed(2)}</p>
          {/* Add more product details here if needed */}

          {/* Button to add product to shopping list */}
          <button onClick={addToShoppingList}>Add to Shopping List</button>
        </div>
      )}

      {/* Display similar products */}
      {similarProducts.length > 0 && (
        <div>
          <h3>Similar Products</h3>
          <ul>
            {similarProducts.map((item) => (
              <li key={item.id}>
                <img src={process.env.PUBLIC_URL + item.image} alt={item.title} />
                <p>{item.title}</p>
                <p>Price: £{item.price.toFixed(2)}</p>
                {/* Add more details or link to the product page if needed */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPage;
















