// Import required packages
const express = require('express');        // Web framework
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const bcrypt = require('bcryptjs');        // To hash and verify passwords
const dotenv = require('dotenv');         // To use environment variables
const connectDB = require('./Connection'); // MongoDB connection module
const mongoose = require('mongoose');     // MongoDB ODM for handling MongoDB queries
const cors = require('cors');             // CORS middleware
const axios = require('axios');           // Import axios for API calls

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

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Fetch news articles based on category or search term
app.get('/news', async (req, res) => {
  const apiKey = 'f427b400450f42f6aacfd99beeda0b7b';
  const query = req.query.q || 'india'; // Use search term if available, otherwise use category
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`
    );
    res.json(response.data); // Return the data to the frontend
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// New route to fetch article by ID
app.get('/article/:id', async (req, res) => {
  const { id } = req.params; // Get the article ID from URL parameter
  const apiKey = 'f427b400450f42f6aacfd99beeda0b7b'; // Your API key

  try {
    // Make API call to NewsAPI to fetch the article
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: apiKey,
        q: id, // Use the article ID as a search query (since NewsAPI doesn't have an "id" endpoint)
        pageSize: 1, // Only get one article
      },
    });

    const articleData = response.data.articles[0]; // Get the first article in the response
    if (articleData) {
      res.json(articleData); // Send article data back to the frontend
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ error: 'Failed to fetch article. Please try again later.' });
  }
});

// Register route (POST /register)
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
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

    // Return the success message
    res.status(200).json({
      success: true,
      message: 'Login successful',
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
