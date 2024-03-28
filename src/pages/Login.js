import React, { Component } from "react";
import "./LoginPage.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userRegister");
      console.log("User Type:", data.userType);
      if (data.status === "ok") {
        alert("Login successful");
        window.localStorage.setItem("token", data.data);
        // Check if userType is defined and is 'admin' (case-insensitive)
        if (data.userType && data.userType.toLowerCase() === 'admin') {
          window.location.href = "./admin";
        } else {
          window.location.href = "./account";
        }
      } else {
        alert("Login failed. Check your credentials.");
      }
    });
    
  }

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="text-center"> {/* Added text-center class */}
            <div className="text">Login</div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="inputs">
              <div className="input">
                <img src="email.png" alt="" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </div>
              <div className="input">
                <img src="password.png" alt="" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </div>
              <div className="submit-container">
                <button type="submit" className="submit">
                  Submit
                </button>
              </div>
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


// import React, { Component } from "react";
// import "./LoginPage.css";

// export default class Login extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: "",
//       password: "",
//     };
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleSubmit(e) {
//     e.preventDefault();
//     const { email, password } = this.state;
//     fetch("http://localhost:5432/login-user", {
//       method: "POST",
//       crossDomain: true,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data, "userRegister");
//         if (data.status === "ok") {
//           alert("Login successful");
//           window.localStorage.setItem("token", data.data);
//           window.location.href = "./account";
//         } else {
//           alert("Login failed. Check your credentials.");
//         }
//       });
//   }

//   render() {
//     return (
//       <div className="auth-wrapper">
//         <div className="auth-inner">
//           <div className="header">
//             <div className="text">Login</div>
//             <div className="underline"></div>
//           </div>
//           <form onSubmit={this.handleSubmit}>
//             <div className="inputs">
//               <div className="input">
//                 <img src="email.png" alt="" />
//                 <input
//                   type="email"
//                   className="form-control"
//                   placeholder="Email"
//                   onChange={(e) => this.setState({ email: e.target.value })}
//                 />
//               </div>
//               <div className="input">
//                 <img src="password.png" alt="" />
//                 <input
//                   type="password"
//                   className="form-control"
//                   placeholder="Password"
//                   onChange={(e) => this.setState({ password: e.target.value })}
//                 />
//               </div>
//               <div className="submit-container">
//                 <button type="submit" className="submit">
//                   Submit
//                 </button>
//               </div>
//               <p className="forgot-password">
//                 Don't have an account? <a href="/signup">Sign up here</a>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }
// }




