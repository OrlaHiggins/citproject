import React, { useState } from "react";
import "./LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
  const [fname, setName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [secretKeyError, setSecretKeyError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include a capital letter and a special character"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5432/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          lname,
          email,
          password,
          userType,
          secretKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setPasswordError(""); // Clear the password error message
        window.location.href = `/login?email=${encodeURIComponent(email)}`; // Pass the email as a query parameter
      } else {
        if (data.error === "Invalid secret key") {
          setSecretKeyError("Invalid secret key"); // Set the secret key error message
        } else {
          throw new Error(data.error || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Something went wrong");
    }
  };

  const validatePassword = (password) => {
    // Regular expression pattern for password validation
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="text-center">
          <div className="text">Sign Up</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="user-type-container">
              <span className="user-type-label">Register As</span>
              <div className="user-type-options">
                <div className="user-type-option">
                  <input
                    type="radio"
                    id="userType-user"
                    name="userType"
                    value="User"
                    checked={userType === "User"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <label htmlFor="userType-user">User</label>
                </div>
                <div className="user-type-option">
                  <input
                    type="radio"
                    id="userType-admin"
                    name="userType"
                    value="Admin"
                    checked={userType === "Admin"}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <label htmlFor="userType-admin">Admin</label>
                </div>
              </div>
            </div>
            {userType === "Admin" && (
              <>
                <div className="input">
                  <img src="key.png" alt="" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Secret Key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>
                {secretKeyError && (
                  <p className="error-message">{secretKeyError}</p>
                )}
              </>
            )}
            <div className="input">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={fname}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={lname}
                onChange={(e) => setLName(e.target.value)}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-toggle"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="password-toggle"
                onClick={togglePasswordVisibility}
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            <div className="submit-container">
              <button type="submit" className="submit">
                Sign Up
              </button>
            </div>
            <p className="forgot-password">
              Already registered?{" "}
              <a href="/login" className="signup-link">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
