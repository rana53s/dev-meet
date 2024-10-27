const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.e41uq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
}

module.exports = connectDB;
