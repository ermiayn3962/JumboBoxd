const express = require('express');
const cors = require('cors');

// Initializing express
const app = express();
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

require('dotenv').config();


// Routes
const accountRoutes = require('./routes/account');
const movieRoutes = require('./routes/movie');
const userRoutes = require('./routes/user');

app.use('/account', accountRoutes);

app.use('/movie', movieRoutes);

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});


module.exports = app;