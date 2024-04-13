import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ListDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faReply } from "@fortawesome/free-solid-svg-icons";

const ListDetails = () => {
  const { listId } = useParams();
  const [listDetails, setListDetails] = useState(null);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [editedList, setEditedList] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cheapestStore, setCheapestStore] = useState(null);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5432/lists/${listId}?token=${token}`
        );
        const listData = response.data;
        console.log("Received list data:", listData); // Log the received data

        if (response.status === 200) {
          setListDetails(listData);
          setEditedList(listData); // Set the initial editedList to the fetched listData
        } else {
          setError("Failed to fetch list details");
          console.error("Error fetching list details:", response.data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching the list details.");
        console.error("Error fetching list details:", error);
      }
    };

    fetchListDetails();
  }, [listId]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (listDetails) {
        const productIds = listDetails.items.map((item) => item.productId);
        const productDetailsPromises = productIds.map(async (productId) => {
          const response = await axios.get(
            `http://localhost:5432/products/${productId}`
          );
          return response.data;
        });
        const fetchedProductDetails = await Promise.all(productDetailsPromises);
        const productDetailsMap = fetchedProductDetails.reduce(
          (acc, product, index) => {
            acc[productIds[index]] = product;
            return acc;
          },
          {}
        );
        setProductDetails(productDetailsMap);
      }
    };

    fetchProductDetails();
  }, [listDetails]);

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5432/products");
        setAvailableProducts(response.data);
      } catch (error) {
        console.error("Error fetching available products:", error);
      }
    };

    fetchAvailableProducts();
  }, []);

  useEffect(() => {
    const findCheapestStore = async () => {
      if (listDetails && productDetails) {
        const stores = {};

        for (const item of listDetails.items) {
          const product = productDetails[item.productId];
          if (product) {
            const response = await axios.get(
              `http://localhost:5432/products?category=${product.category}`
            );
            const storeProducts = response.data;

            storeProducts.forEach((storeProduct) => {
              if (!stores[storeProduct.storeId]) {
                stores[storeProduct.storeId] = {
                  storeId: storeProduct.storeId,
                  totalPrice: 0,
                  products: [],
                };
              }
              stores[storeProduct.storeId].products.push(storeProduct);
            });
          }
        }

        const storeListPrices = {};

        Object.values(stores).forEach((store) => {
          let storeTotalPrice = 0;

          listDetails.items.forEach((item) => {
            const listProduct = productDetails[item.productId];
            const storeProduct = store.products.find(
              (p) => p.category === listProduct.category
            );

            if (storeProduct) {
              storeTotalPrice += storeProduct.price;
            } else {
              storeTotalPrice += listProduct.price;
            }
          });

          storeListPrices[store.storeId] = storeTotalPrice;
        });

        let cheapestStore = null;
        let cheapestTotalPrice = Infinity;

        Object.entries(storeListPrices).forEach(([storeId, totalPrice]) => {
          if (totalPrice < cheapestTotalPrice) {
            cheapestStore = {
              ...stores[storeId],
              totalPrice: totalPrice,
            };
            cheapestTotalPrice = totalPrice;
          }
        });

        setCheapestStore(cheapestStore);
      }
    };

    findCheapestStore();
  }, [listDetails, productDetails]);

  const handleDeleteListItem = (itemIndex) => {
    const updatedList = { ...editedList };
    updatedList.items.splice(itemIndex, 1);
    const updatedTotalPrice = updatedList.items.reduce((total, item) => {
      return total + item.price;
    }, 0);
    updatedList.totalPrice = updatedTotalPrice;
    setEditedList(updatedList);
  };

  const handleAddItem = async (productId) => {
    const product = availableProducts.find((p) => p._id === productId);

    if (product) {
      const newItem = {
        title: product.product,
        productId: product._id,
        price: product.price,
      };
      const updatedList = { ...editedList };
      updatedList.items.push(newItem);
      const updatedTotalPrice = updatedList.items.reduce((total, item) => {
        return total + item.price;
      }, 0);
      updatedList.totalPrice = updatedTotalPrice;
      setEditedList(updatedList); // Update the editedList state

      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:5432/lists/${listId}`,
          updatedList,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("List updated successfully:", response.data);
        setListDetails(response.data.updatedList); // Update the listDetails state with the updated list
        setShowEditModal(false); // Close the edit modal after adding the item
      } catch (error) {
        console.error("Error updating list:", error);
      }
    } else {
      console.error(`Product with ID ${productId} not found in the database.`);
    }
  };

  const handleUpdateList = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5432/lists/${listId}`,
        editedList,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("List updated successfully:", response.data);
      setListDetails(response.data.updatedList); // Update the listDetails state with the updated list
      setEditedList(response.data.updatedList); // Update the editedList state as well
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };
  const calculateTotalPrice = () => {
    return editedList.items.reduce((total, item) => {
      const product = productDetails[item.productId];
      return total + (product ? product.price : 0);
    }, 0);
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

  console.log("listDetails:", listDetails);
  return (
    <div className="list-details-container">
      <Link to="/account" className="back-link">
        <FontAwesomeIcon icon={faReply} />
      </Link>
      <h1 className="list-name">{listDetails.name}</h1>
      <div className="list-details-content">
        <div className="list-details-section">
          <h3 className="section-heading">Cheapest Products</h3>
          <div
            className={`product-grid ${
              window.innerWidth > 1200 ? "large-screen" : ""
            }`}
          >
            {editedList.items.map((item, index) => {
              const product = productDetails[item.productId];

              return (
                <div className="productCard" key={index}>
                  <div className="productImageContainer">
                    {product ? (
                      <Link to={`/products/${product._id}`}>
                        <img
                          src={`http://localhost:5432/${product.imageUrls[0]}`}
                          alt={product.product}
                          className="productImage"
                        />
                      </Link>
                    ) : (
                      <p>Product not found</p>
                    )}
                  </div>
                  <div className="productText">
                    {product ? (
                      <>
                        <h3>{product.product}</h3>
                        <p>Price: £{product.price.toFixed(2)}</p>
                      </>
                    ) : (
                      <p>Product not found</p>
                    )}
                  </div>

                  <div className="product-actions">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => setShowEditModal(true)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="total-price">
            Total Price: £{editedList.totalPrice.toFixed(2)}
          </p>
        </div>
        {cheapestStore && (
          <div className="list-details-section">
            <h3 className="section-heading">
              Cheapest Store: {cheapestStore.storeId}
            </h3>
            <div
              className={`product-grid ${
                window.innerWidth > 1200 ? "large-screen" : ""
              }`}
            >
              {listDetails.items.map((item, index) => {
                const listProduct = productDetails[item.productId];
                const storeProduct = listProduct
                  ? cheapestStore.products.find(
                      (p) => p.category === listProduct.category
                    )
                  : null;

                return (
                  <div className="productCard" key={index}>
                    <div className="productImageContainer">
                      {storeProduct ? (
                        <Link to={`/products/${storeProduct._id}`}>
                          <img
                            src={`http://localhost:5432/${storeProduct.imageUrls[0]}`}
                            alt={storeProduct.product}
                            className="productImage"
                          />
                        </Link>
                      ) : listProduct ? (
                        <Link to={`/products/${listProduct._id}`}>
                          <img
                            src={`http://localhost:5432/${listProduct.imageUrls[0]}`}
                            alt={listProduct.product}
                            className="productImage"
                          />
                        </Link>
                      ) : (
                        <p>Product not found</p>
                      )}
                    </div>
                    <div className="productText">
                      {storeProduct ? (
                        <>
                          <h3>{storeProduct.product}</h3>
                          <p>Price: £{storeProduct.price.toFixed(2)}</p>
                        </>
                      ) : listProduct ? (
                        <>
                          <h3>{listProduct.product}</h3>
                          <p>Price: £{listProduct.price.toFixed(2)}</p>
                        </>
                      ) : (
                        <p>Product not found</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="total-price">
              Total Price: £{cheapestStore.totalPrice.toFixed(2)}
            </p>
          </div>
        )}
      </div>
      {showEditModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit List</h2>
            <ul>
              {editedList.items.map((item, index) => (
                <li key={index}>
                  {item.title} - £
                  {(productDetails[item.productId]?.price || 0).toFixed(2)}
                  <button onClick={() => handleDeleteListItem(index)}>X</button>
                </li>
              ))}
            </ul>
            <div className="add-item-container">
              <select onChange={(e) => handleAddItem(e.target.value)}>
                <option value="">Select a product to add</option>
                {availableProducts
                  .filter(
                    (product) =>
                      !editedList.items.some(
                        (item) => item.productId === product._id
                      )
                  )
                  .map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.product} - £{product.price.toFixed(2)}
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
