const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  UNAUTHORIZED,
  UNAUTHORIZED_REQUEST,
  USER_NOT_FOUND,
  USER_DOES_NOT_EXISTS,
} = require("../utils/constants.js");

const userAuth = async (req, res, next) => {
  try {
    // Read the cookies and token from from the req
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
      return res.status(401).send({
        code: UNAUTHORIZED,
        message: UNAUTHORIZED_REQUEST,
      });
    }

    // Validate the token
    const decodedData = await jwt.verify(
      jwtToken,
      `${process.env.SECRET_ACCESS_TOKEN}`
    );
    const { _id } = decodedData;

    // Find the user from the token data
    const user = await User.findById({ _id: _id });
    if (!user) {
      return res.status(404).send({
        code: USER_NOT_FOUND,
        message: USER_DOES_NOT_EXISTS,
      });
    }
    req.user = user;

    next();
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
