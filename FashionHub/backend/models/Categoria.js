const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Categoria', CategoriaSchema);