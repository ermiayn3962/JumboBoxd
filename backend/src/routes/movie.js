/*
    All movie related API endpoints
*/

const express = require('express');
const router = express.Router();
const mongoPromise = require('../utils/mongo');

/* IF TIME PERMITS ADD REQUEST AUTHENTICATION */
router.get('/saved/:clerkID', async(req, res) => {
    try {
        const clerkID = req.params.clerkID;
    
        const client = await mongoPromise;
        const db = client.db('accounts').collection('users');
        const filter = {'clerkID': clerkID};
    
        const user = await db.findOne(filter);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ savedMovies: user.savedMovies || [] });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/add', async(req, res) => {
    try {
        const clerkID = req.body.clerkID;
        const movieID = req.body.movieID;
    
        const client = await mongoPromise;
        const db = client.db('accounts').collection('users');
        const filter = {'clerkID': clerkID};
    
        const user = await db.findOne(filter);

        //Checking if movieID is contained in user's saved list
        if (user.savedMovies.includes(movieID)) {
            res.status(404).send('Movie is already in the user\'s list');
        } else {
            user.savedMovies.push(movieID);
    
            await db.updateOne(filter, {$set: {'savedMovies':user.savedMovies } } );
    
            res.status(200).send('Successfully added the movie');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/remove', async(req, res) => {
    try {
        const clerkID = req.body.clerkID;
        const movieID = req.body.movieID;
    
        const client = await mongoPromise;
        const db = client.db('accounts').collection('users');
        const filter = {'clerkID': clerkID};
    
        const user = await db.findOne(filter);

        //Checking if movieID is contained in user's saved list
        if (user.savedMovies.includes(movieID)) {
            user.savedMovies.splice(user.savedMovies.indexOf(movieID), 1);
            
            await db.updateOne(filter, {$set: {'savedMovies':user.savedMovies } } );
            
            res.status(200).send('Successfully removed the movie');
        } else {
            res.status(404).send('Movie isn\'t in the user\'s list');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;