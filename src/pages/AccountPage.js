// AccountPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountPage = () => {
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    email: '',
    profilePicture: null,
  });

  useEffect(() => {
    // Fetch user data
    axios.post('http://localhost:5432/userData', { token: localStorage.getItem('token') })
      .then(response => {
        setUserData(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevUserData => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setUserData(prevUserData => ({
      ...prevUserData,
      profilePicture: file
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fname', userData.fname);
    formData.append('lname', userData.lname);
    formData.append('email', userData.email);
    formData.append('profilePicture', userData.profilePicture);

    axios.put('http://localhost:5432/updateUser', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log(response.data);
      // Handle success
    })
    .catch(error => {
      console.error('Error updating user data:', error);
      // Handle error
    });
  };

  return (
    <div>
      <h2>Account Information</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="text" name="fname" value={userData.fname} onChange={handleInputChange} placeholder="First Name" />
        <input type="text" name="lname" value={userData.lname} onChange={handleInputChange} placeholder="Last Name" />
        <input type="email" name="email" value={userData.email} onChange={handleInputChange} placeholder="Email" />
        <input type="file" onChange={handleProfilePictureChange} accept="image/*" />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AccountPage;
