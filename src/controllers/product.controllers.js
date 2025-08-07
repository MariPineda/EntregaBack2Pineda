const path = require('path');
const Product = require('../models/Product');

module.exports = {
    getAll : async (req, res) => {
        const { limit = 10, page = 1, sort, query } = req.query;
        let filter = {};
        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }
        const options = { 
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        }; 
        
        const result = await Product.paginate(filter, options);  

        if (!result.docs.length) {
            console.warn('⚠️ No se encontraron productos con ese filtro o página.');
        }

        const base = `/api/products?limit=${limit}&sort=${sort||''}&query=${query||''}`;
        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${base}&page=${result.prevPage}` : null, 
            nextLink: result.hasNextPage ?  `${base}&page=${result.nextPage}` : null 
        });
    },  
    getById: async (req, res) => {
        const prod = await Product.findById(req.params.pid);
        prod ? res.json(prod) : res.status(404).send('Producto no encontrado');
    },
    create: async (req, res, io) => {
        const prod = await Product.create(req.body);
        io.emit('update-products', await Product.find());
        res.status(201).json(prod);
    },
    update: async (req, res, io) => {
        const prod = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!prod) return res.status(404).send('Producto no encontrado');
        io.emit('update-products', await Product.find());
        res.json(prod);
    },
    delete: async (req, res, io) => {
        const prod = await Product.findByIdAndDelete(req.params.pid);
        prod ? (io.emit('update-products', await Product.find()), res.json({ message: 'Producto eliminado' }))
            : res.status(404).send('Producto no encontrado');
    }
};

