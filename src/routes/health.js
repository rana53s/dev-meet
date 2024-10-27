const express = require('express');
const healthRouter = express.Router();


healthRouter.get('/health', (req, res) => {
    res.send("OK");
});

module.exports = healthRouter;
