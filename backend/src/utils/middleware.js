// const { getAuth } = require('@clerk/express');
const clientPromise = require('../utils/mongo');

/*
 * checkAccount
 * Summary: Checks if a user's account exists by using provided email
 * Params:
 *  - mode {'mustExist' | 'mustNotExist'} 
 *    sets whether function checks if an account exists or not
 * 
 *  - source {'body' | 'params' | 'query'}
 *    sets the type of request sent
 */
const checkAccount = (mode='mustExist', source='body') => async(req, res, next) => {
    try {
        const userEmail = req[source]?.email;

        if (!userEmail) {
            return res.status(400).send('User email is missing and required');
        }

        const mongoClient = await clientPromise;
        const database = mongoClient.db('accounts').collection('users');

        const account = await database.findOne({email:userEmail});

        if (mode === 'mustExist' && !account) {
            return res.status(400).send('Account not found');
        }

        if (mode === 'mustNotExist' && account) {
            return res.status(400).send('Account already exists');
        }

        next();

    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// Check the input format of the request body
const validateSchema = (getSchema) => async (req, res, next) => {
    try {
        const schema = typeof getSchema === 'function' ? await getSchema(req) : getSchema;

        console.log(typeof getSchema === 'function');

        console.log(req.body);

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).send('Error validating body: ' + error.details[0].message);
        }
    } catch (error) {
        console.error('Error in schema validation middleware:', error);
        res.status(500).send('Error validating schema');
    }
    return next();
};


module.exports = {
    checkAccount,
    validateSchema
};
