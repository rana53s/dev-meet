const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth')
const User = require('../models/user')
const { validateEditProfileData } = require('../utils/validation');

profileRouter.get('/view', userAuth, async(req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async(req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Filed is not allowed to update");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        
        res.json({
            messgae: `${loggedInUser.firstName}, your data has been updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

profileRouter.get('/profiles', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.get('/user', async(req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.find({ emailId: userEmail })
        if (user.length === 0) {
            res.status(404).send("User not found")
        } else {
            res.send(user);
        }
        
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body
    const ALLOWED_UPDATES = ["firstName", "lastName", "age", "imageUrl"];

    try {
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            runValidators: true,
            returnDocument: "after"
        })
        res.send("User updated successfully")
    } catch(err) {
        res.status(400).send("Update Failed: " + err.message);
    }
});

module.exports = profileRouter;
