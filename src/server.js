const express = require('express')
const dbConfig = require('./config/db')
const cors = require('cors');

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user-connections');

app.use(express.json())
app.use(cookieParser())

app.use('/', healthRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);

const PORT = process.env.PORT;

dbConfig().then(() => {
    console.log("Connected to the mongo db successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}).catch(err => {
    console.log("DB connection is fail" + err);
})
