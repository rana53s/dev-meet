const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_ITEMS = "firstName lastName imageUrl gender age";

// Get all the pending requets for the logged in user
userRouter.get('/requests/received', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        // Need to get all the req, so logged in user is the toUser
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_ITEMS)

        console.log("Request: ", connectionRequests);
        

        if (connectionRequests.length == 0) {
            res.status(200).send({ message: "No connection request is available for " + loggedInUser.firstName })
        } else {
            const data = connectionRequests.map(row => ({
                requestId: row._id,
                from: row.fromUserId
            }));
            res.status(200).send({ data });
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Get all the connections that are accepted
userRouter.get('/connections', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_ITEMS).populate("toUserId", USER_ITEMS);

        if (connections.length == 0) {
            res.status(200).send({ message: "No connection is available for " + loggedInUser.firstName })
        } else {
            const data = connections.map( row => {
                if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return row.toUserId;
                } else {
                    return row.fromUserId; 
                }
            } );
            res.status(200).send({
                message: `These are the connections available for ${loggedInUser.firstName}`,
                connections: data
            });
        }

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = userRouter;
