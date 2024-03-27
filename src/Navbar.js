import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleAccountLinkClick = (e) => {
    e.preventDefault();
    if (isAdmin) {
      navigate("/add-product");
    } else {
      navigate("/account");
    }
  };

  return (
    <nav className={`navbar ${location.pathname === '/' ? 'homepage-nav' : ''}`}>
      <Link to="/" className="title">
        Trolley Tracker
      </Link>
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
        <li>
          <a href="#" onClick={handleAccountLinkClick}>
            Account
          </a>
        </li>
        <li>
          {isAdmin ? (
            <Link to="/admin/products">Edit Items</Link>
          ) : (
            <Link to="/product-list">Search</Link>
          )}
        </li>
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