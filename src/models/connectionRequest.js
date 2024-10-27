const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['ignored', 'interested', 'accepted', 'rejected'],
                message: `{VALUE} is incorrect status type`
            }
        }
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

connectionRequestSchema.pre("save", function(next) {
    const connReq = this;
    // Check if fromUserId and toUserId are same
    if (connReq.fromUserId.equals(connReq.toUserId)) {
        throw new Error("Connection Request to self is not allowed");
    }
    next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;
