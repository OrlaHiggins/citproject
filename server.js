const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ProductInfo = require("./ProductDetailsSchema");

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow sending cookies from the client
  })
);

// Multer for handling file uploads
const multer = require("multer");
const path = require("path");
const uploadsDir = path.join(__dirname, "public", "uploads");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

const jwt = require("jsonwebtoken");
const List = require("./ListSchema");

const JWT_SECRET = "jnj3njnjnri4j5r8tj5gh85g9vfrt0j5489f5903f";
const mongoURL =
  "mongodb+srv://OrlaHiggins:TrolleyTracker@trolleytracker.1uqccf9.mongodb.net/?retryWrites=true&w=majority";

// Middleware function to extract the JWT token from the Authorization header
const extractToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.token = authHeader.slice(7); // Extracts the token from the Authorization header
  } else {
    req.token = null; // If the Authorization header is not present or doesn't start with 'Bearer ', set token to null
  }
  next(); // Call the next middleware or route handler
};

// Use the extractToken middleware before the routes that require authentication
app.use(extractToken);

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

// Import User model
const { UserDetails } = require("./userDetails");
require("./userDetails");

const User = mongoose.model("UserInfo");

// User registration endpoint
app.post("/register", async (req, res) => {
  console.log("Received registration request body:", req.body);

  const { fname, lname, email, password, userType, secretKey } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    if (userType === "Admin" && secretKey !== "CITproject") {
      return res.status(400).json({ error: "Invalid secret key" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.status(201).json({ status: "ok", message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});

// User login endpoint
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ error: "User not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET);
    // Send user type along with token
    res.json({ status: "ok", data: token, userType: user.userType });
  } else {
    res.json({ status: "error", error: "Invalid Password" });
  }
});

// User data endpoint
app.post("/userData", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify user token to get the user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    User.findById(userId)
      .then((user) => {
        if (user) {
          res.send({ status: "ok", data: user });
        } else {
          res.send({ status: "error", error: "User not found" });
        }
      })
      .catch((error) => {
        res.send({ status: "error", error });
      });
  } catch (error) {
    res.send({ status: "error", error: "Invalid token" });
  }
});
// Update user information endpoint
app.put("/updateUser", upload.single("profilePicture"), async (req, res) => {
  try {
    const { fname, lname, email } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Get the token from the Authorization header

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Find the user by ID and update the details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fname,
        lname,
        email,
        profilePicture: req.file ? req.file.filename : undefined,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Failed to update user information" });
  }
});

// Fetch all users endpoint (admin only)
app.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Get the token from the Authorization header

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const user = await User.findById(userId);
    if (!user || user.userType.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    // Fetch all users from the database
    const users = await User.find({});

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch users. Please try again later." });
  }
});

// Delete user by ID endpoint (admin only)
app.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const token = req.headers.authorization.split(" ")[1]; // Get the token from the Authorization header

    // Verify user token and retrieve admin user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUserId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const adminUser = await User.findById(adminUserId);
    if (!adminUser || adminUser.userType.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Once authorized, proceed with deleting the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Failed to delete user. Please try again later." });
  }
});

// Update user information by ID endpoint (admin only)
app.put("/admin/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fname, lname, email, userType } = req.body;
    const token = req.headers.authorization.split(" ")[1]; // Get the token from the Authorization header

    // Verify user token and retrieve admin user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUserId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const adminUser = await User.findById(adminUserId);
    if (!adminUser || adminUser.userType.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    // Find the user by ID and update the details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fname, lname, email, userType },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Failed to update user information" });
  }
});

// Reset password endpoint
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  // Password validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long, contain at least one capital letter and one special character",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Serve uploaded files
app.use("/public/uploads", express.static(uploadsDir));

// Handle profile picture upload
app.post(
  "/uploadProfilePicture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No profile picture uploaded" });
      }

      const profilePicture = req.file.filename;

      // Get the user ID from the JWT token
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Authentication token missing" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId || decoded._id;

      // Update the user's profilePicture field in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ status: "ok", profilePicture: updatedUser.profilePicture });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  }
);

// Create product endpoint
app.post(
  "/createProduct",
  upload.array("productImages", 5),
  async (req, res) => {
    try {
      const { product, description, category, price, websiteLink, storeId } =
        req.body;
      const imageUrls = req.files.map(
        (file) => `public/uploads/${file.filename}`
      );

      const newProduct = await ProductInfo.create({
        product,
        description,
        category,
        price,
        imageUrls,
        websiteLink,
        storeId,
        updatedAt: Date.now(),
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product." });
    }
  }
);

// Fetch all products endpoint
app.get("/products", async (req, res) => {
  try {
    const products = await ProductInfo.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch products. Please try again later." });
  }
});

// Fetch product by ID endpoint
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductInfo.findById(productId);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch product. Please try again later." });
  }
});

// Delete product by ID endpoint
app.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the productId is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const token = req.headers.authorization.split(" ")[1]; // Get the token from the Authorization header

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const user = await User.findById(userId);
    if (!user || user.userType.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    const product = await ProductInfo.findByIdAndDelete(productId);
    console.log("Deleted product:", product); // Log the deleted product

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send a success response
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Failed to delete product. Please try again later." });
  }
});

// Update product by ID endpoint
app.put("/products/:id", upload.array("productImages", 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const { product, description, category, price, websiteLink, storeId } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `public/uploads/${file.filename}`);
    } else {
      // If no new files are provided, fetch the existing image URLs from the database
      const existingProduct = await ProductInfo.findById(productId);
      imageUrls = existingProduct.imageUrls;
    }

    const updatedProduct = await ProductInfo.findByIdAndUpdate(
      productId,
      {
        product,
        description,
        category,
        price,
        websiteLink,
        storeId,
        imageUrls,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product. Please try again later." });
  }
});
// Endpoint to fetch categories
app.get("/categories", async (req, res) => {
  try {
    // Fetch distinct categories from the ProductInfo model
    const categories = await ProductInfo.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch categories. Please try again later." });
  }
});

// Endpoint to create a new list
app.post("/createList", async (req, res) => {
  try {
    const { token, listName, categories, productId } = req.body;

    console.log("Received token:", token);
    console.log("Received listName:", listName);
    console.log("Received categories:", categories);
    // Verify the token and extract user information
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;
    const userType = decoded.userType;

    if (!userId) {
      console.error("Invalid token or missing userId");
      return res.status(400).json({ error: "Invalid token or missing userId" });
    }

    // Find the cheapest product for each selected category
    const selectedProducts = await Promise.all(
      categories.map(async (category) => {
        const product = await ProductInfo.findOne({ category })
          .sort({ price: 1 })
          .limit(1);
        return product;
      })
    );
    // Add a specific product to the list if productId is provided
    if (productId) {
      const product = await ProductInfo.findById(productId);
      if (product) {
        selectedProducts.push(product);
      }
    }

    console.log("Selected products:", selectedProducts);

    // Calculate the total price of the selected products
    const totalPrice = selectedProducts.reduce((total, product) => {
      return total + (product ? product.price : 0);
    }, 0);
    // Create a new list
    const newList = await mongoose.model("List").create({
      name: listName,
      userId: new mongoose.Types.ObjectId(userId),
      userType: userType, // Set the userType field based on the user's role
      items: selectedProducts
        .filter((product) => product !== null)
        .map((product) => ({
          productId: product._id,
          title: product.product,
          price: product.price,
        })),
      totalPrice: totalPrice,
    });

    // Fetch the user's updated lists after creating the new list
    const userLists = await mongoose
      .model("List")
      .find({ userId: new mongoose.Types.ObjectId(userId) });

    console.log("New list created:", newList);
    console.log("Updated user lists:", userLists);

    res.json({
      status: "ok",
      message: "List created successfully",
      newList,
      userLists,
    });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ status: "error", error: "Failed to create list" });
  }
});
// Endpoint to fetch user's lists
app.get("/userLists", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    console.log("Received token:", token); // Log the received token

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id; 

    console.log("Decoded user from token:", decoded); // Log the decoded user

    // Retrieve user's lists from the database
    const userLists = await mongoose
      .model("List")
      .find({ userId: new mongoose.Types.ObjectId(userId) });

    res.json({ status: "ok", lists: userLists });

    console.log("Retrieved user lists:", userLists); // Log the retrieved user lists
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Error fetching user lists:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to fetch user lists" });
  }
});

// Endpoint to fetch a specific list by ID
app.get("/lists/:listId", async (req, res) => {
  try {
    const listId = req.params.listId;
    const token = req.query.token;

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Find the list by listId first
    const list = await mongoose.model("List").findById(listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Then check if the list belongs to the user
    if (
      list.userId.toString() !== new mongoose.Types.ObjectId(userId).toString()
    ) {
      return res.status(403).json({
        error: "Access denied. You do not have permission to access this list.",
      });
    }

    // Include the product details for each item in the list
    const listWithProductDetails = {
      ...list.toObject(),
      items: await Promise.all(
        list.items.map(async (item) => {
          const product = await ProductInfo.findById(item.productId);
          return {
            ...item.toObject(),
            product: product ? product.toObject() : null,
          };
        })
      ),
    };

    // Calculate the cheapest overall price
    const totalPriceByStore = {};
    listWithProductDetails.items.forEach((item) => {
      if (item.product) {
        const storeId = item.product.storeId; 
        if (!totalPriceByStore[storeId]) {
          totalPriceByStore[storeId] = 0;
        }
        totalPriceByStore[storeId] += item.product.price;
      }
    });
    const cheapestStoreId = Object.keys(totalPriceByStore).reduce((a, b) =>
      totalPriceByStore[a] < totalPriceByStore[b] ? a : b
    );
    const cheapestTotalPrice = totalPriceByStore[cheapestStoreId];

    res.json({
      ...listWithProductDetails,
      cheapestTotalPrice,
      cheapestStoreId,
    });
  } catch (error) {
    console.error("Error fetching list details:", error);
    res.status(500).json({ error: "Failed to fetch list details" });
  }
});

// Endpoint to update a list by ID
app.put("/lists/:listId", async (req, res) => {
  try {
    const listId = req.params.listId;
    const token = req.headers.authorization.split(" ")[1];
    const updatedList = req.body;

    // Verify the token and extract user information
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Find the list by ID and update it
    const list = await mongoose
      .model("List")
      .findOneAndUpdate(
        { _id: listId, userId: userId },
        { $set: updatedList },
        { new: true }
      );

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json({ message: "List updated successfully", updatedList: list });
  } catch (error) {
    console.error("Error updating list:", error);
    res
      .status(500)
      .json({ error: "Failed to update list. Please try again later." });
  }
});
// Endpoint to delete a list by ID
app.delete("/lists/:listId", async (req, res) => {
  try {
    const listId = req.params.listId;
    console.log("Received listId:", listId);

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    console.log("Querying database with listId:", listId); 
    const list = await mongoose.model("List").findById(listId);

    console.log("Found list:", list); // Log the found list

    if (!list) {
      console.log("List not found"); // Log if the list is not found
      return res.status(404).json({ error: "List not found" });
    }

    if (
      list.userId.toString() !== new mongoose.Types.ObjectId(userId).toString()
    ) {
      return res.status(403).json({
        error: "Access denied. You do not have permission to delete this list.",
      });
    }

    await mongoose.model("List").findByIdAndDelete(listId);

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res
      .status(500)
      .json({ error: "Failed to delete list. Please try again later." });
  }
});
// Endpoint to add a product to a list
app.post("/lists/:listId/add-product", async (req, res) => {
  try {
    const { listId } = req.params;
    const { productId } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    const list = await mongoose.model("List").findById(listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    if (
      list.userId.toString() !== new mongoose.Types.ObjectId(userId).toString()
    ) {
      return res.status(403).json({
        error:
          "Access denied. You do not have permission to add products to this list.",
      });
    }

    const product = await ProductInfo.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    list.items.push({
      productId: product._id,
      title: product.product,
      price: product.price,
    });

    // Update the total price of the list
    list.totalPrice += product.price;

    await list.save();

    res.json({ message: "Product added to list successfully", list });
  } catch (error) {
    console.error("Error adding product to list:", error);
    res.status(500).json({
      error: "Failed to add product to list. Please try again later.",
    });
  }
});
// Endpoint to fetch admin-created lists
app.get("/adminLists", async (req, res) => {
  try {
    // Retrieve admin-created lists from the database
    const adminLists = await mongoose.model("List").find({ userType: "admin" });

    res.json({ status: "ok", lists: adminLists });
  } catch (error) {
    console.error("Error fetching admin lists:", error);
    res
      .status(500)
      .json({ status: "error", error: "Failed to fetch admin lists" });
  }
});
// Start the server
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
