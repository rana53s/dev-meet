const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const {
  validateSignUpData,
  validateIfPasswordIsStrong,
} = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    // Encrypt the password
    const {
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password,
      imageUrl,
      skills,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password: hashedPassword,
      imageUrl,
      skills,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error while adding the user:- " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validation of emailId
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email address: " + emailId);
    }

    // Find the user if exists
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error(
        "No user is found with the credentials, please enter valid ones"
      );
    }

    // Validate the password
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT token
      const token = await user.getJWT();

      // Add the token to a cookie and send the response back to the user
      res.cookie("jwtToken", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 1 hour
      });

      res.status(200).send({
        status: "success",
        info: user.firstName + " signed in successfully!",
        data: user,
      });
    } else {
      throw new Error(
        "No user is found with the credentials, please enter valid ones"
      );
    }
  } catch (err) {
    res.status(400).send({
      status: "failure",
      message: err.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("jwtToken", null, { expires: new Date(Date.now()) });
  res.send("Logged out");
});

// Develop the forgot password
authRouter.patch("/reset-password", userAuth, async (req, res) => {
  // Take the new password from the req body and validate the password is strong enough
  const { password } = req.body;
  validateIfPasswordIsStrong(password);

  // Make it hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the password into the DB
  const user = req.user;
  user.password = hashedPassword;
  await user.save();

  res.send("Password updated successfully");
});

module.exports = authRouter;
