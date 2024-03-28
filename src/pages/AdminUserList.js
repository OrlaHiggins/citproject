import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUserList.css';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = window.localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5432/userData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          const data = await response.json();

          if (
            data.status === 'ok' &&
            data.data.userType &&
            data.data.userType.toLowerCase() === 'admin'
          ) {
            setIsAdmin(true);
            fetchUsers(); // Call fetchUsers if the user is an admin
          } else {
            setIsAdmin(false);
            // Redirect to the login page or display an error message
          }
        } catch (error) {
          console.error('Error during fetch:', error);
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
      const token = window.localStorage.getItem('token');
      const response = await axios.get('http://localhost:5432/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing. Redirecting to login page.');
        // Redirect to the login page or display an error message
        return;
      }

      console.log('Deleting user with ID:', userId);

      // Make the DELETE request to the backend endpoint
      const response = await axios.delete(`http://localhost:5432/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      // Handle error
    }
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) =>
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <tr key={user._id}>
                          <td>{user.fname}</td>
                          <td>{user.email}</td>
                          <td>{user.userType}</td>
                          <td>
                            <div className="buttons">
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                Delete
                              </button>
                            </div>
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