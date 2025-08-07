const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controllers');

module.exports = (io) => {
    router.get('/', controller.getAll);
    router.get('/:pid', controller.getById);
    router.post('/', (req, res) => controller.create(req, res, io));
    router.put('/:pid', (req, res) => controller.update(req, res, io));
    router.delete('/:pid', (req, res) => controller.delete(req, res, io)); 

    return router;
};

