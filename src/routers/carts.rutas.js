const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controllers');

router.post('/', controller.create);
router.get('/:cid', controller.getById);
router.post('/:cid/products/:pid', controller.addProduct);

router.delete('/:cid/products/:pid', controller.deleteProduct);
router.put('/:cid', controller.updateCart);
router.put('/:cid/products/:pid', controller.updateProductQuantity);
router.delete('/:cid', controller.deleteAllProducts); 

module.exports = router