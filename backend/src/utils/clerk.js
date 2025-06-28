const { createClerkClient } = require('@clerk/backend');

/* Creating the clerk client for backend to use */
const clerkClient = createClerkClient({
    secretKey : process.env.CLERK_SECRET_KEY
});

module.exports = clerkClient;