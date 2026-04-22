const mongoose = require('mongoose')

const seguimientoSchema = new mongoose.Schema(
    {
        id_embarazo:{type: Number, required: true},
        analisisClinicos:[
            {
                tipo_analisis:{type:String, required: true},
                fecha:{type:Date, required: true},
                resultado: {type:String},
                id_analisis:{type:Number, required:true},
                _id:false
            }
        ],
        ultrasonidos:[
            {
                fecha:{type:Date, required:true},
                semanas_estimadas:{type:Number, required:true},
                observaciones:{type: String},
                id_ultrasonido:{type:Number, required:true},
                _id:false
            }
        ],
        controlPrenatal:[
            {
                presion_arterial:{type: String},
                peso:{type: Number},
                fecha_control:{type:Date, required:true},
                id_control:{type:Number, required:true},
                _id:false
            }
        ]
    },
    {
        collection: 'seguimientoEmbarazo' // Ajusta al nombre exacto de la colección en tu DB
    }
)
module.exports = mongoose.model('SeguimientoEmbarazo', seguimientoSchema)