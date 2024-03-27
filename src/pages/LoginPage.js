// import React, { useState } from 'react';
// import Login from './Login';
// import Signup from './Signup';
// import './LoginPage.css';

// const LoginPage = () => {
//   const [action, setAction] = useState('Login');

//   return (
//     <div>
//       {action === 'Login' ? <Login /> : <Signup />}
//       <div className='submit-container'>
//         <div className={action === 'Login' ? 'submit gray' : 'submit'} onClick={() => setAction('Sign Up')}>
//           Sign Up
//         </div>
//         <div className={action === 'Sign Up' ? 'submit gray' : 'submit'} onClick={() => setAction('Login')}>
//           Login
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




// LoginPage.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import './LoginPage.css';

// const LoginPage = () => {
//   const [action, setAction] = useState('Login');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (action === 'Login') {
//         // Add login logic here using axios.post
//         const response = await axios.post('http://localhost:5432/login', {
//           email: email,
//           password: password,
//         });

//         console.log(response.data);

//         // Add logic to handle the response (redirect, show a message, etc.)
//       } else {
//         // Add signup logic here using axios.post
//         const response = await axios.post('http://localhost:5432/signup', {
//           name: name,
//           email: email,
//           password: password,
//         });

//         console.log(response.data);

//         // Add logic to handle the response (redirect, show a message, etc.)
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       // Handle error, e.g., display an error message to the user
//     }
//   };

//   return (
//     <div className='container'>
//       <form onSubmit={handleSubmit}>
//         <div className="header">
//           <div className="text">{action}</div>
//           <div className="underline"></div>
//         </div>
//         {action === 'Login' ? null : (
//           <div className="input">
//             <img src="personlogin.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
     
//      )}
//         <div className="input">
//           <img src="email.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="input">
//           <img src="password.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {action === 'Sign Up' ? null : <div className="forgot-password">Lost Password? <span>Click Here</span></div>}
//         <div className="submit-container">
//           <div className={action === 'Login' ? 'submit gray' : 'submit'} onClick={() => setAction('Sign Up')}>Sign Up</div>
//           <div className={action === 'Sign Up' ? 'submit gray' : 'submit'} onClick={() => setAction('Login')}>Login</div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// import React, { useState } from 'react';
// import './LoginPage.css';

// export default class Signup extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: "",
//       email: "",
//       password: "",
//     };
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//   handleSubmit(e) {
//     e.preventDefault();
//     const { name, email, password } = this.state;
//     console.log(name, email, password);
//     fetch("http://localhost:5432/register",{
//       method:"POST",
//       crossDomain:true,
//       headers:{
//         "Content-Type":"application/json",
//         Accept:"application/json",
//         "Access-Control-Allow-Origin":"*",
//       },
//       body:JSON.stringify({
//         name,
//         email,
//         password
//       }),
//     }).then((res) => res.json())
//     .then((data) => {
//       console.log(data, "userRegister");
//     })
//   }
// }

// // const LoginPage = () => {
// //   const [action, setAction] = useState("Login");
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log(name, email, password);
    
//   // };

//   return (
//     <div className='container'>
//       <form onSubmit={handleSubmit}>
//         <div className="header">
//           <div className="text">{action}</div>
//           <div className="underline"></div>
//         </div>
//         <div className="inputs">
//           {action === "Login" ? null : (
//             <div className="input">
//               <img src="personlogin.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           )}
//           <div className="input">
//             <img src="email.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="input">
//             <img src="password.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//         </div>
//         {action === "Sign Up" ? null : <div className="forgot-password">Lost Password? <span>Click Here</span></div>}
//         <div className="submit-container">
//           <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
//           <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default LoginPage;




// import React, { useState } from 'react';
// import './LoginPage.css';

// const LoginPage = () => {
//   const [action, setAction] = useState("Login");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(name, email, password);
//     // Add logic to handle form submission or API calls here
//   };

//   return (
//     <div className='container'>
//       <form onSubmit={handleSubmit}>
//         <div className="header">
//           <div className="text">{action}</div>
//           <div className="underline"></div>
//         </div>
//         <div className="inputs">
//           {action === "Login" ? null : (
//             <div className="input">
//               <img src="personlogin.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//           )}
//           <div className="input">
//             <img src="email.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="input">
//             <img src="password.png" alt="" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//         </div>
//         {action === "Sign Up" ? null : <div className="forgot-password">Lost Password? <span>Click Here</span></div>}
//         <div className="submit-container">
//           <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
//           <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import './LoginPage.css'

// const LoginPage = () => {
//   const history = useNavigate();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [action, setAction] = useState('login');

//   const authenticateUser = async () => {
//     try {
//       const response = await axios.post('http://localhost:5432/', {
//         name,
//         email,
//         password,
//         action, // 'login' or 'signup'
//       });

//       if (response.data === 'exist') {
//         history('/home', { state: { id: email } });
//       } else if (response.data === 'notexist' && action === 'login') {
//         alert('User does not exist. Please sign up.');
//       } else if (response.data === 'notexist' && action === 'signup') {
//         alert('User already exists. Please login.');
//       }
//     } catch (error) {
//       alert('Error processing request. Please try again.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className='container'>
//       <div className='header'>
//         <div className='text'>Login or Sign Up</div>
//         <div className='underline'></div>
//       </div>
//       <div className='inputs'>
//         {action === 'login' && (
//           <div className='input'>
//             <img
//               src='personlogin.png'
//               alt=''
//               style={{ marginRight: '10px', width: '20px', height: '20px' }}
//             />
//             <input
//               type='text'
//               placeholder='Name'
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//         )}
//         <div className='input'>
//           <img
//             src='email.png'
//             alt=''
//             style={{ marginRight: '10px', width: '20px', height: '20px' }}
//           />
//           <input
//             type='email'
//             placeholder='Email'
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className='input'>
//           <img
//             src='password.png'
//             alt=''
//             style={{ marginRight: '10px', width: '20px', height: '20px' }}
//           />
//           <input
//             type='password'
//             placeholder='Password'
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//       </div>
//       <div className='submit-container'>
//         <div className='submit' onClick={authenticateUser}>
//           {action === 'login' ? 'Login' : 'Sign Up'}
//         </div>
//       </div>
//       <div className='forgot-password'>
//         {action === 'login' ? (
//           <>
//             Don't have an account?{' '}
//             <span onClick={() => setAction('signup')}>Sign Up</span>
//           </>
//         ) : (
//           <>
//             Already have an account?{' '}
//             <span onClick={() => setAction('login')}>Login here</span>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

