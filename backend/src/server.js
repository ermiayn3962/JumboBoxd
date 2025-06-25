/*
    server.js
    Points to an entry point for the server
*/

const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});