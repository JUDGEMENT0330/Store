const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    carrito: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Producto'
            },
            cantidad: {
                type: Number,
                default: 1
            }
        }
    ],
    pedidos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Pedido'
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema);