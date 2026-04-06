const mongoose = require('mongoose');

const seguimientoEmbarazo = new mongoose.Schema ({
        id_embarazo: { type: Number, required: true },
    analisisClinicos: {
        tipo_analisis: { type: String, required: true},
        fecha: { type: Date, required: true },
        resultado: { type: String, required: true }   
    },
    ultrasonidos: {
        fecha: { type: Date, required: true},
        semanas_estimadas: { type: Number, required: true},
        observaciones: { type: String, required: true}
    },
    controlPrenatal: {
        presion_arterial: { type: String, required: true},
        peso: { type: Number, required: true },
        fecha_control: { type: Date, required: true}
    }
}, { timestamps: true, collection: 'seguimientoEmbarazo' });
module.exports = mongoose.model('seguimientoEmbarazo', seguimientoEmbarazo);