const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client's origin
  credentials: true, // Allow sending cookies from the client
}));

// Multer for handling file uploads
const multer = require("multer");
const path = require("path");
const uploadsDir = path.join(__dirname, 'public', 'uploads');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Upload files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});
const upload = multer({ storage: storage });

app.use(express.json());

const jwt = require('jsonwebtoken');
const List = require('./ListSchema');

const JWT_SECRET = "jnj3njnjnri4j5r8tj5gh85g9vfrt0j5489f5903f";
const mongoURL = 'mongodb+srv://OrlaHiggins:TrolleyTracker@trolleytracker.1uqccf9.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((e) => console.log(e));

// Add the import statement for the schema
const ProductDetailsSchema = require('./ProductDetailsSchema');

// Register the schema
const Product = mongoose.models.ProductInfo || mongoose.model('ProductInfo', ProductDetailsSchema);

require('./userDetails');

const User = mongoose.model('UserInfo');

app.post('/register', async (req, res) => {
  console.log('Received registration request body:', req.body);

  const { fname, lname, email, password, userType } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType
    });
    res.status(201).json({ status: 'ok', message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

app.post('/login-user', async (req, res) => {
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
    res.json({ status: 'error', error: 'Invalid Password' });
  }
});

app.post('/userData', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify user token to get the user's ID
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail }).then((data) => {
      if (data) {
        res.send({ status: 'ok', data });
      } else {
        res.send({ status: 'error', error: 'User not found' });
      }
    })
      .catch((error) => {
        res.send({ status: 'error', error });
      });
  } catch (error) {
    res.send({ status: 'error', error: 'Invalid token' });
  }
});

// Update User Route
app.put('/updateUser', async (req, res) => {
  try {
    const { fname, lname, email } = req.body;

    // Find the user by email and update the details
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { fname, lname },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User information updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Failed to update user information' });
  }
});

// Add this new endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const user = await User.findById(userId);
    if (!user || user.userType.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Fetch all users from the database
    const users = await User.find({});

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users. Please try again later.' });
  }
});

// Add this new endpoint to delete a user by ID
app.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header

    // Verify user token and retrieve admin user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUserId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const adminUser = await User.findById(adminUserId);
    if (!adminUser || adminUser.userType.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Once authorized, proceed with deleting the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user. Please try again later.' });
  }
});

app.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No profile picture uploaded' });
    }

    const profilePicture = req.file.filename;

    res.status(200).json({ status: 'ok', profilePicture });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

const isAdmin = (req, res, next) => {
  // Assuming user information is stored in req.user after authentication
  if (req.user && req.user.userType === 'Admin') {
    // User is an admin, allow access to the next middleware or route handler
    next();
  } else {
    // User is not an admin, return a forbidden error
    res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
  }
};

// Serve uploaded images
app.use('/public/uploads', express.static(uploadsDir));

// Register route for product upload
app.post('/createProduct', upload.array('productImages', 5), async (req, res) => {
  try {
    const { product, description, category, price } = req.body;
    const imageUrls = req.files.map(file => `public/uploads/${file.filename}`); // Correctly construct image URLs

    const newProduct = await Product.create({
      product,
      description,
      category,
      price,
      imageUrls
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Fetch products endpoint
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products. Please try again later.' });
  }
});

// Fetch product by ID endpoint
app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: 'Failed to fetch product. Please try again later.' });
  }
});

// app.get('/categories', async (req, res) => {
//   try {
//     const categories = await ProductInfo.distinct('category');
//     res.json(categories);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     res.status(500).json({ error: 'Failed to fetch categories. Please try again later.' });
//   }
// });

// Delete product by ID endpoint
app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if the productId is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Check if the user is an admin
    const user = await User.findById(userId);
    if (!user || user.userType.toLowerCase() !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const product = await Product.findById(productId);
    console.log('Retrieved product:', product); // Log the retrieved product

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Once authorized, proceed with deleting the product
    await Product.findByIdAndDelete(productId);

    // Send a success response
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product. Please try again later.' });
  }
});

// Update product by ID endpoint
app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { product, description, category } = req.body;

    // Verify if the productId is a valid ObjectId
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { product, description, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product. Please try again later.' });
  }
});
// Add a new endpoint to fetch categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: 'Failed to fetch categories. Please try again later.' });
  }
});

// Update the createList endpoint
app.post('/createList', async (req, res) => {
  try {
    const { token, listName, categories } = req.body;

    console.log('Received token:', token);
    console.log('Received listName:', listName);
    console.log('Received categories:', categories);

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded user from token:', decoded);

    const userId = decoded.userId || decoded._id;

    if (!userId) {
      console.error('Invalid token or missing userId');
      return res.status(400).json({ error: 'Invalid token or missing userId' });
    }

    const selectedProducts = await Promise.all(
      categories.map(async (category) => {
        const product = await Product.findOne({ category }).sort({ price: 1 }).limit(1);
        return product;
      })
    );

    console.log('Selected products:', selectedProducts);

    const totalPrice = selectedProducts.reduce((total, product) => {
      return total + (product ? product.price : 0);
    }, 0);
    
    const newList = await mongoose.model('List').create({
      name: listName,
      userId: new mongoose.Types.ObjectId(userId),
      items: selectedProducts.filter(product => product !== null).map(product => ({
        productId: product._id,
        title: product.product,
        price: product.price,
      })),
      totalPrice: totalPrice,
    });

    console.log('New list created:', newList);

    res.json({ status: 'ok', message: 'List created successfully', newList });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ status: 'error', error: 'Failed to create list' });
  }
});

app.get('/userLists', async (req, res) => {
  try {
    const token = req.query.token; // Get the token from the query parameters

    console.log('Received token:', token); // Log the received token

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id; // Use decoded.userId or decoded._id (depending on how you store the user ID in the JWT token)

    console.log('Decoded user from token:', decoded); // Log the decoded user

    // Retrieve user's lists from the database
    const userLists = await mongoose.model('List').find({ userId: new mongoose.Types.ObjectId(userId) });

    res.json({ status: 'ok', lists: userLists });

    console.log('Retrieved user lists:', userLists); // Log the retrieved user lists

    // res.json({ status: 'ok', lists: userLists });
  } catch (error) {
    console.error('Error fetching user lists:', error);
    res.status(500).json({ status: 'error', error: 'Failed to fetch user lists' });
  }
});

app.get('/lists/:listId', async (req, res) => {
  try {
    const listId = req.params.listId;
    const token = req.query.token;

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Find the list by listId first
    const list = await mongoose.model('List').findById(listId);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    // Then check if the list belongs to the user
    if (list.userId.toString() !== new mongoose.Types.ObjectId(userId).toString()) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to access this list.' });
    }

    // Include the product details for each item in the list
    const listWithProductDetails = {
      ...list.toObject(),
      items: await Promise.all(
        list.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          return {
            ...item.toObject(),
            product: product ? product.toObject() : null,
          };
        })
      ),
    };

    res.json(listWithProductDetails);
  } catch (error) {
    console.error('Error fetching list details:', error);
    res.status(500).json({ error: 'Failed to fetch list details' });
  }
});

// Update list by ID endpoint
app.put('/lists/:listId', async (req, res) => {
  try {
    const listId = req.params.listId;
    const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header
    const updatedList = req.body; // Assuming you're sending the updated list data in the request body

    // Verify user token and retrieve user's ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    // Find the list by listId first
    const list = await mongoose.model('List').findById(listId);

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    // Then check if the list belongs to the user
    if (list.userId.toString() !== new mongoose.Types.ObjectId(userId).toString()) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to update this list.' });
    }

    // Update the list with the provided data
    const updatedDoc = await mongoose.model('List').findByIdAndUpdate(listId, updatedList, { new: true });

    res.json({ message: 'List updated successfully', updatedList: updatedDoc });
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Failed to update list. Please try again later.' });
  }
});
// Delete list by ID endpoint
app.delete('/lists/:listId', async (req, res) => {
  try {
    const listId = req.params.listId;
    console.log('Received listId:', listId);

    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    console.log('Querying database with listId:', listId); // Add this logging statement
    const list = await mongoose.model('List').findById(listId);

    console.log('Found list:', list); // Log the found list

    if (!list) {
      console.log('List not found'); // Log if the list is not found
      return res.status(404).json({ error: 'List not found' });
    }

    if (list.userId.toString() !== new mongoose.Types.ObjectId(userId).toString()) {
      return res.status(403).json({ error: 'Access denied. You do not have permission to delete this list.' });
    }

    await mongoose.model('List').findByIdAndDelete(listId);

    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Failed to delete list. Please try again later.' });
  }
});
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 

// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');

// // Multer for handling file uploads
// const multer = require("multer");
// const path = require("path");
// const uploadsDir = path.join(__dirname, 'public', 'uploads');

// // Configure storage for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir); // Upload files to the 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Use the original filename
//   }
// });
// const upload = multer({ storage: storage });

// app.use(express.json());
// app.use(cors());

// const jwt = require('jsonwebtoken');

// const JWT_SECRET = "jnj3njnjnri4j5r8tj5gh85g9vfrt0j5489f5903f";
// const mongoURL = 'mongodb+srv://OrlaHiggins:TrolleyTracker@trolleytracker.1uqccf9.mongodb.net/?retryWrites=true&w=majority';

// mongoose
//   .connect(mongoURL, {
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch((e) => console.log(e));

// // Add the import statement for the schema
// const ProductDetailsSchema = require('./ProductDetailsSchema');

// // Register the schema
// const Product = mongoose.models.ProductInfo || mongoose.model('ProductInfo', ProductDetailsSchema);

// require('./userDetails');

// const User = mongoose.model('UserInfo');

// app.post('/register', async (req, res) => {
//   console.log('Received registration request body:', req.body);

//   const { fname, lname, email, password, userType } = req.body;

//   try {
//     const oldUser = await User.findOne({ email });

//     if (oldUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const encryptedPassword = await bcrypt.hash(password, salt);

//     await User.create({
//       fname,
//       lname,
//       email,
//       password: encryptedPassword,
//       userType
//     });
//     res.status(201).json({ status: 'ok', message: 'Registration successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', error: 'Internal server error' });
//   }
// });


// app.post('/login-user', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.json({ error: "User not found" });
//   }

//   if (await bcrypt.compare(password, user.password)) {
//     const token = jwt.sign({ email: user.email }, JWT_SECRET);

//     // Check the status of the response object directly
//     if (res.status(201)) {
//       return res.json({ status: "ok", data: token });
//     } else {
//       return res.json({ error: "error" });
//     }
//   }

//   res.json({ status: 'error', error: 'Invalid Password' });
// });

// app.post('/userData', async (req, res) => {
//   const { token } = req.body;

//   try {
//     const user = jwt.verify(token, JWT_SECRET);
//     console.log(user);
//     const useremail = user.email;
//     User.findOne({ email: useremail }, 'fname lname') // Specify the fields to include in the query projection
//       .then((data) => {
//         if (data) {
//           res.send({ status: 'ok', data });
//         } else {
//           res.send({ status: 'error', error: 'User not found' });
//         }
//       })
//       .catch((error) => {
//         res.send({ status: 'error', error });
//       });
//   } catch (error) {
//     res.send({ status: 'error', error: 'Invalid token' });
//   }
// });

// // Middleware function to check if the provided secret key matches
// const validateSecretKey = (req, res, next) => {
//   const { secretKey } = req.body;

//   const ADMIN_SECRET_KEY = "CITproject";

//   if (secretKey === ADMIN_SECRET_KEY) {
//     next(); // Move to the next middleware or route handler
//   } else {
//     res.status(403).json({ error: "Access forbidden. Invalid secret key." });
//   }
// };

// // Serve uploaded images
// app.use('/public/uploads', express.static(uploadsDir));

// // Register route for product upload
// app.post('/createProduct', validateSecretKey, upload.array('productImages', 5), async (req, res) => {
//   try {
//     const { product, description, category } = req.body;
//     const imageUrls = req.files.map(file => `public/uploads/${file.filename}`); // Correctly construct image URLs

//     const newProduct = await Product.create({
//       product,
//       description,
//       category,
//       imageUrls
//     });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ error: 'Failed to create product.' });
//   }
// });

// // Fetch products endpoint
// app.get('/products', async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: 'Failed to fetch products. Please try again later.' });
//   }
// });

// // Fetch product by ID endpoint
// app.get('/products/:id', async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     res.json(product);
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).json({ error: 'Failed to fetch product. Please try again later.' });
//   }
// });

// app.listen(5432, () => {
//   console.log('Server Started');
// });





// // const User = mongoose.model('UserInfo');
// // const { UserDetails, ShoppingList } = require('./userDetails');

// //API Creation
// // app.get("/",(req,res)=>{
// //   res.send("Express App is Running")
// // })

// // Image Storage Engine
// // const storage = multer.diskStorage({
// //   destination: './upload/images',
// //   filename: (req, file, cb) => {
// //     return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
// //   }
// // });

// // const upload = multer({ storage: storage });

// // Creating upload endpoint for images
// // app.use('/images', express.static('upload/images'));

// // app.post("/upload", upload.single('products'), (req, res) => {
// //   res.json({
// //     success: 1,
// //     image_url: `http://localhost:${port}/images/${req.file.filename}`
// //   });
// // });

// app.use(express.json());
// app.use(cors());

// app.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, userType } = req.body;

//     // Create a new user instance
//     const user = new UserDetails({ name, email, password, userType });

//     // Save the user to the database
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


  
// app.post('/login-user', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//         return res.json({ error: "User not found" });
//     }

//     if (await bcrypt.compare(password, user.password)) {
//         const token = jwt.sign({email: user.email}, JWT_SECRET);
        
//         // Check the status of the response object directly
//         if (res.status(201)) {
//             return res.json({ status: "ok", data: token });
//         } else {
//             return res.json({ error: "error" });
//         }
//     }

//     res.json({ status: 'error', error: 'Invalid Password' });
// });



//   const PORT = process.env.PORT || 5432;
//   app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);
//   });

