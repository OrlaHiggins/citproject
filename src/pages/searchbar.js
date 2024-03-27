import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./searchbar.css";
import data from "./GroceryData.json";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div className="templateContainer">
        <div className="searchInput_Container">
          <div className="searchInput">
            <input
              id="searchInput"
              type="text"
              placeholder="Search here..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="template_Container">
          {data
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.title.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return val;
              }
            })
            .map((val) => {
              return (
                <div className="template" key={val.id}>
                  {/* Link each product to its product details page */}
                  {/* <Link to={`/products/${val.id}`}> */}
                  <Link to={`/products/${val.id}?category=${val.category}`}>

                    <div className="image-container">
                      <img
                        src={process.env.PUBLIC_URL + val.image}
                        alt={val.title}
                        className="template-image"
                      />
                      <button className="addToListButton">Add to list</button>
                    </div>
                    <h3>{val.title}</h3>
                    <p className="price">£{val.price.toFixed(2)}</p>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default SearchBar;







