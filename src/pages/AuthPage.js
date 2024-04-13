// import React, { useState } from "react";
// import axios from "axios";
// import "./LoginPage.css";

// const AuthPage = ({ title, onSubmit }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     onSubmit({ name, email, password });
//   };

//   return (
//     <div>
//       <h1>{title}</h1>
//       <form onSubmit={handleSubmit}>
//         {title === "Signup" && (
//           <div>
//             <label>Name:</label>
//             <input type="text" onChange={(e) => setName(e.target.value)} />
//           </div>
//         )}
//         <div>
//           <label>Email:</label>
//           <input type="email" onChange={(e) => setEmail(e.target.value)} />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit">{title}</button>
//       </form>
//     </div>
//   );
// };

// export default AuthPage;
