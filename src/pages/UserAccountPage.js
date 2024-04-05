import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./UserAccountPage.css";

const UserAccountPage = () => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);

  // You can store the available profile pictures in an array
  const availableProfilePictures = [
    "/uploads/pandaavatar.png",
    "/public/uploads/foxavatar.png",
    "/public/uploads/catblue.png",
    "/public/uploads/bear.png",
  ];

  useEffect(() => {
    // Fetch user data from the server and update state
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:5432/userData", { token });
        if (response.data.status === "ok") {
          const { fname, lname, email, profilePicture } = response.data.data;
          setUser({ fname, lname, email, profilePicture });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5432/updateUser",
        {
          fname: user.fname,
          lname: user.lname,
          email: user.email || '', // Ensure email is not empty
          profilePicture: selectedProfilePicture || user.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        setIsEditing(false);
        setUser({ ...user, profilePicture: selectedProfilePicture || user.profilePicture });
      } else {
        console.error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleProfilePictureSelect = (pictureUrl) => {
    setSelectedProfilePicture(pictureUrl);
    setShowProfilePictureModal(false);
  };

  return (
    <div className="userAccountContainer">
      <h2>Account Details</h2>
      <div className="userProfile">
      <div className="profilePictureWrapper">
        {/* <img
          src={user.profilePicture ? `/public/uploads/${user.profilePicture}` : "/default-profile.jpg"}
          alt="Profile"
          className="profilePicture"
        />
        {!user.profilePicture && (
          <div className="addPhotoText" onClick={() => setShowProfilePictureModal(true)}>
            Add Photo
          </div>
        )}
        {user.profilePicture && isEditing && (
          <div className="changePhotoText" onClick={() => setShowProfilePictureModal(true)}>
            Change Photo
          </div>
        )} */}
        <input
          type="file"
          id="profilePictureInput"
          accept="image/*"
          onChange={(e) => {
            setSelectedProfilePicture(e.target.files[0]);
            console.log('Selected profile picture:', e.target.files[0]);
            handleSaveClick();
          }}
          style={{ display: "none" }}
        />
        {/* <label htmlFor="profilePictureInput" className="uploadButton">
          {user.profilePicture ? "Change Photo" : "Upload Photo"}
        </label> */}
      </div>
    </div>
      <div className="userDetails">
        <label>First Name</label>
        <input
          type="text"
          value={user.fname}
          readOnly={!isEditing}
          onChange={(e) => setUser({ ...user, fname: e.target.value })}
        />
      </div>
      <div className="userDetails">
        <label>Last Name</label>
        <input
          type="text"
          value={user.lname}
          readOnly={!isEditing}
          onChange={(e) => setUser({ ...user, lname: e.target.value })}
        />
      </div>
      <div className="userDetails">
        <label>Email</label>
        <input
          type="email"
          value={user.email}
          readOnly={!isEditing}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>
      <div className="actionButtons">
        {isEditing ? (
          <>
            <button className="saveButton" onClick={handleSaveClick}>
              Save
            </button>
            <button className="cancelButton" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="editButton" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </div>

      {showProfilePictureModal && (
      <div className="profile-picture-modal">
        <div className="modal-content">
          <h3>Select Profile Picture</h3>
          <div className="profile-picture-options">
            {availableProfilePictures.map((pictureUrl, index) => (
              <div
                key={index}
                className={`profile-picture-option ${selectedProfilePicture === pictureUrl ? 'selected' : ''}`}
                onClick={() => handleProfilePictureSelect(pictureUrl)}
              >
                <img src={pictureUrl} alt={`Profile Picture ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <button className="cancelButton" onClick={() => setShowProfilePictureModal(false)}>
              Cancel
            </button>
            <button className="saveButton" onClick={() => handleSaveClick()}>
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default UserAccountPage;

