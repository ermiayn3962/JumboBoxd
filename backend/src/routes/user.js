/*
    All user related endpoints
*/

const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { getAuth } = require('@clerk/express');

const router = express.Router();
const mongoPromise = require('../utils/mongo');

router.get('/signIn', ClerkExpressRequireAuth(), async(req, res) => {

    try {
        const { userId } = getAuth(req);

        // Validating User in  MongoDB 
        const client = await mongoPromise;
        const db = client.db('accounts').collection('users');
        const user = await db.findOne({ 'clerkID' : userId });

        if (!user) {
            res.status(404).send('User not found in DB');
        }

        res.status(200).send('User successfully signed in');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }

});



module.exports = router;