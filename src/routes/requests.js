const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/send/:status/:userId', userAuth, async(req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ['ignored', 'interested'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status type:  " + status);
        }

        // Check if the user is present in your DB by toUserId
        const isToUserExist = await User.findById(toUserId);
        if (!isToUserExist) {
            throw new Error("To User doesn't exist");
        }

        // Check if there is an existing Connection Request
        const isRequestExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (isRequestExist) {
            res.status(400).send({ message: "Request is already made" });
        } else {
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });
    
            const data = await connectionRequest.save();
    
            const toUser = await User.findById(toUserId);
    
            res.json({
                message: `Connection request sent successfully from ${req.user.firstName} to ${toUser.firstName}`,
                data
            });
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    } 
});

/* Request Review API */
requestRouter.post('/review/:status/:requestId', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user; // toUserId from the above API

        // Get the fromUserId who has sent the request
        const { status, requestId } = req.params;

        // Validate the status if it's accepted/rejected
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status type:  " + status);
        }

        // Find the connection request by requestId if it's exists in the DB & Get the details
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            throw new Error("Connection request not found");
        }

        // If connectionRequest make the status to accepted/rejected in DB
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: `Connection request has ${status}`,
            data
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }

});

module.exports = requestRouter;
