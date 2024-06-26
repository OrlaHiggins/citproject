import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import "./LoginPage.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    const queryParams = new URLSearchParams(window.location.search);
    const emailFromParam = queryParams.get("email");

    this.state = {
      email: emailFromParam || "",
      password: "",
      error: "",
      showPassword: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    fetch("http://localhost:5432/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        console.log("User Type:", data.userType);
        if (data.status === "ok") {
          window.localStorage.setItem("token", data.data);
          // Check if userType is defined and is 'admin' (case-insensitive)
          if (data.userType && data.userType.toLowerCase() === "admin") {
            window.location.href = "./admin";
          } else {
            window.location.href = "./account";
          }
        } else {
          this.setState({
            error: "Incorrect username or password. Please try again.",
          });
        }
      });
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const { showPassword } = this.state;
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="text-center">
            <div className="text">Login</div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="inputs">
              <div className="input">
                <FontAwesomeIcon icon={faEnvelope} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </div>
              <div className="input">
                <FontAwesomeIcon icon={faLock} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggle"
                  onClick={this.togglePasswordVisibility}
                />
              </div>
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              <div className="submit-container">
                <button type="submit" className="submit">
                  Submit
                </button>
              </div>
              <p className="forgot-password">
                Forgot password? <a href="/reset-password">Reset here</a>
              </p>
              <p className="forgot-password">
                Don't have an account? <a href="/signup">Sign up here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
