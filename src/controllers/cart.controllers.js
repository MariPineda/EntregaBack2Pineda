const path = require('path');
const Cart = require('../models/Cart');  
const mongoose = require('mongoose');

module.exports ={ 
    create: async (req, res) => {
        const cart = await Cart.create({ products: [] });
        res.status(201).json(cart);
    },
    getById : async (req, res) => {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).send('Carrito no encontrado');
        res.json(cart);
    }, 
    addProduct: async (req, res) => {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        const existingItem = cart.products.find(p => {
            return p.product && p.product.toString() === req.params.pid;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    },
    deleteProduct: async (req, res) => {
        const { cid, pid } = req.params;

        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }

            cart.products.splice(productIndex, 1);
            await cart.save();

            return res.json({ message: 'Producto eliminado del carrito', cart });
        } catch (error) {
            console.error('Error eliminando producto del carrito:', error);
            res.status(500).json({ message: 'Error interno al eliminar el producto' });
        }
    },
    updateCart : async (req, res) => { 
        const cart = await Cart.findById(req.params.cid);
        cart.products = req.body.products || [];
        await cart.save();
        res.json(cart);
    }, 
    updateProductQuantity: async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: 'La cantidad debe ser un número entero mayor a 0' });
        }

        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const productInCart = cart.products.find(p => p.product.toString() === pid);
            if (!productInCart) {
                return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            }

            productInCart.quantity = quantity;
            await cart.save();

            res.json({ message: 'Cantidad actualizada', cart });
        } catch (err) {
            console.error('Error actualizando cantidad:', err);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    deleteAllProducts : async (req, res) => {
        const cart = await Cart.findById(req.params.cid); 
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        cart.products = [];
        await cart.save();
        res.json(cart)
    }
};
