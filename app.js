// app.js

require('dotenv').config();

const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes'); // Import user routes
const materialRoutes = require('./routes/materialRoutes');

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // Use user routes

// Basic route to ensure the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the enginlib API');
});

// Courses materials
app.use('/materials', materialRoutes);

// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
