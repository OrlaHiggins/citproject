import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage.js";
import SignUp from "./pages/Signup.js";
import "./App.css";
import { Navbar } from "./Navbar.js";
import Account from "./pages/account.js";
import { AuthProvider } from "./pages/AuthContext";
import Login from "./pages/Login.js";
// import SearchBar from "./pages/searchbar";
// import { ShoppingListForm } from "./pages/ShoppingListForm";
import Footer from "./Footer";
import AdminAddProducts from "./pages/AdminAddProducts";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import ListDetails from "./pages/ListDetails";
import AdminProductList from "./pages/AdminProductList";
import EditProduct from "./pages/EditProduct";
import UserAccountPage from "./pages/UserAccountPage.js";
import AdminUserList from "./pages/AdminUserList";
import AdminDashboard from "./pages/AdminDashboard";
import FAQs from "./pages/FAQs";
import AboutUs from "./pages/AboutUs";
import ResetPassword from "./pages/ResetPassword.js";

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/search" element={<SearchBar />} /> */}
              <Route path="/account" element={<Account />} />
              {/* <Route path="/list" element={<ShoppingListForm />} /> */}
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/add-product" element={<AdminAddProducts />} />
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/lists/:listId" element={<ListDetails />} />
              <Route path="/admin/products" element={<AdminProductList />} />
              <Route
                path="/edit-product/:productId"
                element={<EditProduct />}
              />
              <Route path="/user-account" element={<UserAccountPage />} />
              <Route path="/admin/users" element={<AdminUserList />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
