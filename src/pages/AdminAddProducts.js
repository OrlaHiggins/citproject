import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAddProducts.css';

function AdminAddProducts() {
    const [product, setProduct] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [websiteLink, setWebsiteLink] = useState('');
    const [storeId, setStoreId] = useState(""); 

    useEffect(() => {
        const fetchUserData = async () => {
            const token = window.localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch('http://localhost:5432/userData', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    const data = await response.json();

                    if (
                        data.status === 'ok' &&
                        data.data.userType &&
                        data.data.userType.toLowerCase() === 'admin'
                    ) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                        navigate('/login'); // Redirect to login page for non-admin users
                    }
                } catch (error) {
                    console.error('Error during fetch:', error);
                    // Handle error
                }
            } else {
                setIsAdmin(false);
                navigate('/login'); // Redirect to login page if not logged in
            }

            setIsLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const handleLogout = () => {
        //     // Perform logout actions
        //     window.localStorage.removeItem("token");
        //     navigate('/login');
        // };

        const token = window.localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing. Redirecting to login page.");
            navigate("/login");
            return;
        }

        const formData = new FormData();
  formData.append('product', product);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('websiteLink', websiteLink); // Include the websiteLink field
  formData.append('productImages', image);
  formData.append('storeId', storeId);
  try {
    const response = await axios.post('http://localhost:5432/createProduct', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(response.data);
    // Reset form fields or perform any other actions after successful submission
  } catch (err) {
    console.error(err);
  }
};
    

    return (
        <div className="container">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {isAdmin ? (
                        <>
<div className="admin-details">
    <h2>Admin</h2>
</div>
<div className="underline"></div>
<form onSubmit={handleSubmit}>
    <div className="inputs">
        {/* <h2>Add Product</h2> */}
        {error && <p className="error-message">{error}</p>}
        <div className="input">
            <label htmlFor="">Product:</label>
            <input
                type="text"
                placeholder="Enter Product"
                className="form-control"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
            /> 
                                    </div>
                                    <div className="input">
                                        <label htmlFor="">Description:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Description"
                                            className="form-control"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                    <div className="input">
                                        <label htmlFor="">Category:</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Category"
                                            className="form-control"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        />
                                    </div>
                                    <div className="input">
                                        <label htmlFor="">Price:</label>
                                        <input
                                            type="number"
                                            placeholder="Enter Price"
                                            className="form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="input">
                                        <label htmlFor="">Image:</label>
                                        <input
                                            type="file"
                                            placeholder="image/*"
                                            className="form-control"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                    </div>
                                    <div className="input">
        <label htmlFor="">Store ID:</label>
        <input
          type="text"
          placeholder="Enter Store ID"
          className="form-control"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
        />
      </div>
                                    <div className="input">
      <label htmlFor="">Website Link:</label>
      <input
        type="text"
        placeholder="Enter Website Link"
        className="form-control"
        value={websiteLink}
        onChange={(e) => setWebsiteLink(e.target.value)}
      />
    </div>
                                    <div className="submit-container">
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div>
                            <p>
                                You are not authorized to access this page.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
    
}

export default AdminAddProducts;


// import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react'; // Import useHistory from react-router-dom
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function AdminAddProducts() {
//     const [product, setProduct] = useState("");
//     const [description, setDescription] = useState("");
//     const [category, setCategory] = useState("");
//     const [image, setImage] = useState(null);
//     const [isLoggedIn, setIsLoggedIn] = useState(true);
//     const [error, setError] = useState("");
//     const history = useHistory(); // Use useHistory to access the history object

//     useEffect(() => {
//         const token = window.localStorage.getItem("token");
//         if (!token) {
//             setIsLoggedIn(false);
//         }
//     }, []);
    
//      const handleSubmit = async (e) => {
//         e.preventDefault();

//         const token = window.localStorage.getItem("token");
//         if (!token) {
//             console.error("Token is missing. Redirecting to login page.");
//             window.location.href = "/Login";
//             return;
//         }

//         try {
//             const formData = new FormData();
//             formData.append("product", product);
//             formData.append("description", description);
//             formData.append("category", category);
//             formData.append("productImages", image);

//             const response = await axios.post(
//                 "http://localhost:5432/createProduct",
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );

//             console.log(response.data);
//             history.push("/success-page"); // Redirect to a suitable page after successful submission
//         } catch (err) {
//             console.error(err);
//             setError("Failed to create product. Please try again.");
//         }
//     };    

//     return (
//         <div className="container">
//             <div className="header">
//                 <div className="text">Admin</div>
//                 <div className="underline"></div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="inputs">
//                         <h2>Add Product</h2>
//                         {error && <p className="error-message">{error}</p>}
//                         <div className="input">
//                             <label htmlFor="">Product:</label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Product"
//                                 className="form-control"
//                                 value={product}
//                                 onChange={(e) => setProduct(e.target.value)}
//                             />
//                         </div>
//                         <div className="input">
//                             <label htmlFor="">Description:</label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Description"
//                                 className="form-control"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />
//                         </div>
//                         <div className="input">
//                             <label htmlFor="">Category:</label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter Category"
//                                 className="form-control"
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}
//                             />
//                         </div>
//                         <div className="input">
//                             <label htmlFor="">Image:</label>
//                             <input
//                                 type="file"
//                                 placeholder="image/*"
//                                 className="form-control"
//                                 onChange={(e) => setImage(e.target.files[0])}
//                             />
//                         </div>
//                         <div className="submit-container">
//                             <button type="submit" className="btn btn-primary">
//                                 {" "}
//                                 Submit{" "}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default AdminAddProducts;





