import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./LoginPage.css";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      newPassword: "",
      error: "",
      showPassword: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, newPassword } = this.state;
    fetch("http://localhost:5432/reset-password", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ email, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Password reset successful") {
          window.location.href = "./login";
        } else {
          this.setState({ error: data.error });
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
            <div className="text">Reset Password</div>
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
                  placeholder="New Password"
                  onChange={(e) => this.setState({ newPassword: e.target.value })}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggle"
                  onClick={this.togglePasswordVisibility}
                />
              </div>
              {this.state.error && <div className="error">{this.state.error}</div>}
              <div className="submit-container">
                <button type="submit" className="submit">
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}