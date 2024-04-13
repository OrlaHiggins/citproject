import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserAccountPage.css";

const UserAccountPage = () => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from local storage:", token);

      if (token) {
        const response = await axios.post("http://localhost:5432/userData", {
          token,
        });
        console.log("Response from server:", response.data);

        if (response.data.status === "ok") {
          const { fname, lname, email, profilePicture } = response.data.data;
          setUser({ fname, lname, email, profilePicture });
          setIsLoggedIn(true);
        } else if (
          response.data.status === "error" &&
          response.data.error === "User not found"
        ) {
          // If the user is not found, clear the user data and set isLoggedIn to false
          setUser({
            fname: "",
            lname: "",
            email: "",
            profilePicture: "",
          });
          setIsLoggedIn(false);
          setErrorMessage("User not found. Please log in again.");
        } else {
          setErrorMessage("Failed to fetch user data");
        }
      } else {
        setIsLoggedIn(false);
        setErrorMessage("Please log in to view your account details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to fetch user data");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setSelectedProfilePicture(file);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fname", user.fname);
      formData.append("lname", user.lname);
      formData.append("email", user.email);
      if (selectedProfilePicture) {
        formData.append("profilePicture", selectedProfilePicture);
      }

      const response = await axios.put(
        "http://localhost:5432/updateUser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        setUser(response.data.user);
      } else {
        console.error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <div className="userAccountContainer">
      {isLoggedIn ? (
        <>
          <h2>Account Details</h2>
          <div className="userProfile">
            <div className="profilePictureWrapper">
              <img
                className="profilePicture"
                src={user.profilePicture || "/default-profile-picture.png"}
                alt="Profile"
              />
              {isEditing && (
                <label
                  htmlFor="profilePictureInput"
                  className="changePhotoText"
                >
                  Change Photo
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
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
                <button
                  className="cancelButton"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="editButton" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="errorMessage">{errorMessage}</div>
      )}
    </div>
  );
};

export default UserAccountPage;
