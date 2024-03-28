import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
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

  const handleLogoutClick = () => {
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
  };

  return (
    <nav className={`navbar ${location.pathname === "/" ? "homepage-nav" : ""}`}>
      {isAdmin ? (
        <Link to="/admin" className="title">
          Trolley Tracker
        </Link>
      ) : (
        <Link to="/" className="title">
          Trolley Tracker
        </Link>
      )}
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
        {isLoggedIn && !isAdmin && (
          <li
            className="dropdown"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            <a href="#">Account</a>
            {showAccountDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <a href="#" onClick={() => handleDropdownItemClick("/user-account")}>
                    Account Details
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleDropdownItemClick("/account")}>
                    Shopping List
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
            <a href="#">Admin</a>
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
        {!isAdmin && (
          <li>
            <Link to="/product-list">Products</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;




// export default function NavBar(){
//     return (
//         <nav className="nav">
//             <a href="/" className="site=title">
//                 Trolley Tracker
//             </a>
//             <ul>
//                 <li>
//                     <a href="/account">Account</a>
//                 </li>
//                 <li>
//                     <a href="/lists">Lists</a>
//                 </li>
//             </ul>
//         </nav>
//     )
// }