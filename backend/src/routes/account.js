/* 
    All account related API endpoints

*/

const express = require('express');
const clerkClient = require('../utils/clerk');
const mongoPromise = require('../utils/mongo');
const bcrypt = require('bcrypt');
const { checkAccount, validateSchema } = require('../utils/middleware');
const { accountCreationSchema, accountUpdateSchema } = require('../utils/accountSchema');


const router = express.Router();

/* 
 * Summary: User account creation endpoint
 */ 
router.post('/creation',
    validateSchema(accountCreationSchema), 
    checkAccount('mustNotExist', 'body'),
    async (req, res) => {

    try {
        // Creating user via Clerk API
        const clerkResponse = await clerkClient.users.createUser({
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'emailAddress': [req.body.email],
            'password': req.body.password,
            'skipPasswordChecks': true
        });
    
        // Creating user account in Mongo
        const client = await mongoPromise;
        const db = client.db('accounts').collection('users');

        await db.insertOne({
            'firstName':req.body.firstName,
            'lastName':req.body.lastName,
            'email':req.body.email,
            'clerkID':clerkResponse.id,
            'password': await bcrypt.hash(req.body.password, 10),
            'savedMovies': []
        });

        res.status(200).send('User created successfully', JSON.stringify(clerkResponse));
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error', error);
    }
});


router.delete('/deletion', 
    validateSchema(accountUpdateSchema),
    async (req, res) => {
    
    const userID = req.body.id;
    
    try {
        // Delete user from Mongo
        const client = await mongoPromise;
        const db = client.db('accounts').collection('users');

        const mongoResponse = await db.deleteOne({'clerkID':userID});

        console.log(mongoResponse);

        if (mongoResponse.deleteCount === 0) {
            res.status(404).send('User not found');
        } else {
            // Delete user from Clerk
            await clerkClient.users.deleteUser(userID);
    
            res.status(200).send(`User ${userID} successfully deleted`);

        }
    
        
    } catch (error) {
        res.status(500).send('Server Error', error);
    }
});

// ADD ACCOUNT EDITING IF TIME ALLOWS

module.exports = router;