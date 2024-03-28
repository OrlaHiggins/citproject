import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5432/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.status === "ok" && data.data.userType === "Admin") {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDeleteUsers = () => {
    navigate("/admin/users");
  };

  const handleDeleteProducts = () => {
    navigate("/admin/products");
  };

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-actions">
        <button onClick={handleDeleteUsers}>Manage Users</button>
        <button onClick={handleDeleteProducts}>Manage Products</button>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </div>
  );
};

export default AdminDashboard;