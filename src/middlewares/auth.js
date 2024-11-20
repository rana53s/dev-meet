const jwt = require('jsonwebtoken');
const User = require('../models/user')
const userAuth = async (req, res, next) => {
    try {
        // Read the cookies and token from from the req
        const { jwtToken } = req.cookies;
        if (!jwtToken) {
            throw new Error("Unauthorized request, please login first");
        }

        // Validate the token
        const decodedData = await jwt.verify(jwtToken, `${process.env.SECRET_ACCESS_TOKEN}`);
        const { _id } = decodedData;

        // Find the user from the token data
        const user = await User.findById( {_id: _id} );
        if (!user) {
            throw new Error("No user is found")
        }
        req.user = user;

        next();
    } catch (err) {
        res.status(404).send("Error: " + err.message);
    }
}

module.exports = {
    userAuth
}
