const express = require('express');

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send({message: 'here will be categories'});
    });

    return router;
};



module.exports = createRouter;
