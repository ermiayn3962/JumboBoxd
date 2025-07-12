const express = require('express');

// Initializing express
const app = express();
app.use(express.json());

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