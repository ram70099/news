const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Ram:ramshah@cluster0.5ngbg.mongodb.net/react_news');
        // mongodb://127.0.0.1:27017/CRUD
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB; // Export the connection function
