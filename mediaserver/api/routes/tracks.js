const express = require('express');
const router = express.Router();
const Tracks = require('./../models/tracks');

// handle GET to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Fetch all tracks.',
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity,
    };
    res.status(201).json({
        message: 'Tracks were created',
        order: order,
    });
});

router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Track details',
        orderID: req.params.orderID,
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Track deleted',
        orderID: req.params.orderID,
    });
});

module.exports = router;