// Import required packages
const express = require('express');        // Web framework
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const bcrypt = require('bcryptjs');        // To hash and verify passwords
const dotenv = require('dotenv');         // To use environment variables
const connectDB = require('./Connection'); // MongoDB connection module
const mongoose = require('mongoose');     // MongoDB ODM for handling MongoDB queries
const cors = require('cors');             // CORS middleware

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();  // Call the function from db.js to establish MongoDB connection

/// Define the User model
// Define the User model
const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true, // You can choose if it's required
      unique: true, // Ensure username is unique
    },
});

const User = mongoose.model('User', UserSchema);


// Register route (POST /register)
app.post('/register', async (req, res) => {
    const { email, password,username } = req.body;
    console.log(req.body);

    // Validate the email and passwords
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }



    try {
      // Check if the email already exists in MongoDB
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user and save to MongoDB
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

  // Login route (POST /login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    
    // Validate the email and password fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required' });
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Generate a JWT token
      

      // Return the token and a success message
      res.status(200).json({
        success: true,
        message: 'Login successful',
         // Send the token to the client
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

// Start the server on a given port (5000 or from .env)
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
