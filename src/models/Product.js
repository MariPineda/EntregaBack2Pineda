const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    status: { type: Boolean, default: true },
    thumbnails: [String]
});

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);
