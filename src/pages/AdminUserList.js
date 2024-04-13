import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./AdminUserList.css";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    fname: "",
    lname: "",
    email: "",
    userType: "",
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
            fetchUsers(); // Call fetchUsers if the user is an admin
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

  const fetchUsers = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get("http://localhost:5432/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing. Redirecting to login page.");
        // Redirect to the login page or display an error message
        return;
      }

      console.log("Deleting user with ID:", userId);

      // Make the DELETE request to the backend endpoint
      const response = await axios.delete(
        `http://localhost:5432/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      // Handle error
    }
  };

  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    setEditUserId(userId);
    setEditedUser({
      fname: userToEdit.fname,
      lname: userToEdit.lname,
      email: userToEdit.email,
      userType: userToEdit.userType,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveUser = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing. Redirecting to login page.");
        // Redirect to the login page or display an error message
        return;
      }

      const response = await axios.put(
        `http://localhost:5432/admin/users/${editUserId}`,
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the users state with the updated user data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editUserId ? response.data.user : user
        )
      );

      setEditUserId(null);
      setEditedUser({
        fname: "",
        lname: "",
        email: "",
        userType: "",
      });
    } catch (err) {
      console.error("Error updating user:", err);
      // Handle error
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditedUser({
      fname: "",
      lname: "",
      email: "",
      userType: "",
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
                  placeholder="Search users..."
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
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>User Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) =>
                        user.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user._id}>
                          <td>
                            {editUserId === user._id ? (
                              <input
                                type="text"
                                name="fname"
                                value={editedUser.fname}
                                onChange={handleInputChange}
                              />
                            ) : (
                              user.fname
                            )}
                          </td>
                          <td>
                            {editUserId === user._id ? (
                              <input
                                type="text"
                                name="lname"
                                value={editedUser.lname}
                                onChange={handleInputChange}
                              />
                            ) : (
                              user.lname
                            )}
                          </td>
                          <td>
                            {editUserId === user._id ? (
                              <input
                                type="email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleInputChange}
                              />
                            ) : (
                              user.email
                            )}
                          </td>
                          <td>
                            {editUserId === user._id ? (
                              <select
                                name="userType"
                                value={editedUser.userType}
                                onChange={handleInputChange}
                              >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                              </select>
                            ) : (
                              user.userType
                            )}
                          </td>
                          <td>
                            {editUserId === user._id ? (
                              <div className="buttons">
                                <button onClick={handleSaveUser}>Save</button>
                                <button onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="buttons">
                                <button
                                  className="edit-button"
                                  onClick={() => handleEditUser(user._id)}
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                                <button
                                  className="delete-button"
                                  onClick={() => handleDeleteUser(user._id)}
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

export default AdminUserList;
