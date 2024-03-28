import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccountPage.css"; // Import the CSS file

const UserAccountPage = () => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the server and update state
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5432/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: localStorage.getItem("token") }),
        });
        const data = await response.json();
        if (data.status === "ok") {
          const { fname, lname, email, profilePicture } = data.data;
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
      const response = await fetch("http://localhost:5432/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: user.fname,
          lname: user.lname,
          email: user.email,
        }),
      });
  
      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }

    // Logic to upload profile picture
    if (selectedImage) {
        const formData = new FormData();
        formData.append("profilePicture", selectedImage);
    
        try {
          const response = await fetch("http://localhost:5432/uploadProfilePicture", {
            method: "POST",
            body: formData,
          });
    
          if (response.ok) {
            const data = await response.json();
            setUser({ ...user, profilePicture: data.profilePicture });
          } else {
            console.error("Failed to upload profile picture");
          }
        } catch (error) {
          console.error("Error uploading profile picture:", error);
        }
      }
    };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <div className="userAccountContainer">
      <h2>Account Details</h2>
      <div className="userProfile">
      <input
  type="file"
  id="profilePictureInput"
  accept="image/*"
  onChange={handleImageChange}
  style={{ display: "none" }}
/>
        <label htmlFor="profilePictureInput">
          <div className="profilePictureWrapper">
            <img
              src={user.profilePicture || "/default-profile.jpg"}
              alt="Profile"
              className="profilePicture"
            />
            {!user.profilePicture && <div className="addPhotoText">Add Photo</div>}
            {user.profilePicture && isEditing && (
              <div className="changePhotoText">Change Photo</div>
            )}
          </div>
        </label>
        <input
          type="file"
          id="profilePictureInput"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
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
    </div>
  );
};

export default UserAccountPage;


