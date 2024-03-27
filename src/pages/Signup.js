import React, { useState } from "react";
import "./LoginPage.css";

export default function SignUp() {
  const [fname, setName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert("Something went wrong");
    }
  };
  
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        {/* <div className="header"> */}
        <div className="text-center">
          <div className="text">Sign Up</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div>
              Register As
              <input
                type="radio"
                name="userType"
                value="User"
                onChange={(e) => setUserType(e.target.value)}
              />
              User
              <input
                type="radio"
                name="userType"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </div>
            {userType === "Admin" && (
              <div className="input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Secret Key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            )}
            <div className="input">
            <img src="personlogin.png" alt="" />
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={fname}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input">
            <img src="email.png" alt="" />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input">
            <img src="password.png" alt="" />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="submit-container">
              <button type="submit" className="submit">
                Sign Up
              </button>
            </div>
            <p className="forgot-password">
              Already registered? <a href="/login" className="signup-link">Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
