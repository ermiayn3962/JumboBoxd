/* 
    All account related API endpoints

*/

const express = require('express');
// const { MongoClient } = require('mongodb');

const router = express.Router();

// const MONGODB_URI = `mongodb+srv://yodaermias:${process.env.MONGODB_URI}@cluster0.gakeltx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

/* 
 * Summary: User account creation endpoint
 */ 
router.post('/creation', async (req, res) => {

    
    res.status(200).send('HI this is working');
});


module.exports = router;