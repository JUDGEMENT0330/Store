const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PedidoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    productos: [
        {
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            imagen: { type: String, required: true }, // Storing first image for convenience
            precio: { type: Number, required: true },
            producto: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Producto'
            }
        }
    ],
    total: {
        type: Number,
        required: true,
        default: 0.0
    },
    direccionEnvio: {
        direccion: { type: String, required: true },
        ciudad: { type: String, required: true },
        codigoPostal: { type: String, required: true },
        pais: { type: String, required: true }
    },
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'pagado', 'enviado', 'entregado'],
        default: 'pendiente'
    },
    stripePaymentIntentId: {
        type: String,
        // Not always required, e.g., for other payment methods, but required for Stripe.
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pedido', PedidoSchema);