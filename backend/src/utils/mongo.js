/*
    mongo.js
    This file is used to connect to the mongoDB database
*/

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!clientPromise) {
    client = new MongoClient(uri);

    clientPromise = client.connect();
}

module.exports = clientPromise;