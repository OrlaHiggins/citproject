import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const fetchUserData = async () => {
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
            setIsLoggedIn(true);
          } else {
            setIsAdmin(false);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      } else {
        setIsAdmin(false);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest(".sidebar")) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogoutClick = () => {
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
<nav className="navbar">
  <div className="nav-content">
    {isAdmin ? (
      <Link to="/" className="title" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/white-background.png" alt="Trolley Tracker Logo" style={{ height: '70px', marginRight: '10px' }} />
        <span>Trolley Tracker</span>
      </Link>
    ) : (
      <Link to="/" className="title" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="/white-background.png" alt="Trolley Tracker Logo" style={{ height: '70px', marginRight: '10px' }} />
        <span>Trolley Tracker</span>
      </Link>
        )}
        <div className="nav-links">
          <ul>
            <li>
              {isLoggedIn ? (
                <a href="#" onClick={handleLogoutClick}>
                  Log Out
                </a>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
            {isLoggedIn && (
              <li
                className="dropdown"
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <a href="#">{isAdmin ? "User View" : "Account"}</a>
                {showUserDropdown && (
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#" onClick={() => handleDropdownItemClick("/user-account")}>
                        Account Details
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => handleDropdownItemClick("/account")}>
                        My Lists
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            )}
            {isAdmin && (
              <li
                className="dropdown"
                onMouseEnter={() => setShowAdminDropdown(true)}
                onMouseLeave={() => setShowAdminDropdown(false)}
              >
                <a href="#">Admin View</a>
                {showAdminDropdown && (
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#" onClick={() => handleDropdownItemClick("/add-product")}>
                        Add Product
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => handleDropdownItemClick("/admin/products")}>
                        Edit Items
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => handleDropdownItemClick("/admin/users")}>
                        Edit Users
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            )}
            {/* {isLoggedIn && isAdmin && ( */}
              <li>
                <Link to="/product-list">Products</Link>
              </li>
            {/* )} */}
          </ul>
        </div>
        <div className={`menu-icon ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </div>
      </div>
      <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        <ul>
          <li>
            {isLoggedIn ? (
              <a href="#" onClick={handleLogoutClick}>
                Log Out
              </a>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
          {isLoggedIn && (
            <li>
              <Link to="/user-account">Account Details</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/account">My Lists</Link>
            </li>
          )}
              {/* {isLoggedIn && ( */}
            <li>
              <Link to="/product-list">Products</Link>
            </li>
          {/* )} */}
          {/* {isLoggedIn && isAdmin && (
            <li>
              <Link to="/product-list">Products</Link>
            </li>
          )} */}
          {isAdmin && (
            <li>
              <Link to="/add-product">Add Product</Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin/products">Edit Items</Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin/users">Edit Users</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;