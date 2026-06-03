const Embarazo = require('../models/Embarazo.model');
const SeguimientoEmbarazo = require('../models/seguimientoEmbarazo.model');

class seguimientoEmbarazoController {
    static async createSeguimientoEmbarazo(req, res) {
        try {
            const { id_embarazo } = req.body;

            const embarazos = await Embarazo.obtenerPorId(id_embarazo);
            if (!embarazos || embarazos.length === 0) {
                return res.status(404).json({ message: 'Embarazo no encontrado' });
            }

            const seguimiento = new SeguimientoEmbarazo({
                id_embarazo,
                analisisClinico: [],
                ultrasonidos: [],
                controlPrenatal: []
            });
            await seguimiento.save();
            return res.status(201).json(seguimiento);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async buscararchivo(req, res) {
        try {
            const id_embarazo = Number(req.query.id_embarazo || req.query.id);

            if (!id_embarazo) {
                return res.status(400).json({ message: 'Falta id_embarazo en query params (?id_embarazo=1 o ?id=1)' });
            }

            const resultado = await SeguimientoEmbarazo.find({ id_embarazo });
            if (!resultado || resultado.length === 0) {
                return res.status(404).json({ message: 'Seguimiento de embarazo no encontrado' });
            }
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async agregarAnalisis(req, res) {
        try {
            const existeid = await SeguimientoEmbarazo.findOne({ analisisClinicos: { $elemMatch: { id_analisis: Number(req.body.id_analisis) } } });
            if (existeid) {
                return res.status(404).json({ message: 'id existente por favor ingrese otro' });
            }
            const { id_embarazo, tipo_analisis, fecha, resultado,id_analisis } = req.body;
            if (!id_embarazo || !tipo_analisis || !fecha || id_analisis == null) {
                return res.status(400).json({ message: 'Datos requeridos incompletos' });
            }

            const nuevo = { tipo_analisis, fecha, resultado,id_analisis };
            const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
                { id_embarazo: Number(id_embarazo) },
                { $push: { analisisClinicos: nuevo } },
                { returnDocument: 'after', upsert: true }
            );

            return res.status(200).json(actualizado);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async agregarUltrasonido(req, res) {
        try {
            const existeid = await SeguimientoEmbarazo.findOne({ ultrasonidos: { $elemMatch: { id_ultrasonido: Number(req.body.id_ultrasonido) } } });
            if (existeid) {
                return res.status(404).json({ message: 'id existente por favor ingrese otro' });
            }
            const { id_embarazo, fecha, semanas_estimadas, observaciones,id_ultrasonido } = req.body;
            if (!id_embarazo || !fecha || semanas_estimadas == null || id_ultrasonido == null) {
                return res.status(400).json({ message: 'Datos requeridos incompletos' });
            }

            const nuevo = { fecha, semanas_estimadas, observaciones,id_ultrasonido };
            const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
                { id_embarazo: Number(id_embarazo) },
                { $push: { ultrasonidos: nuevo } },
                { returnDocument: 'after', upsert: true }
            );

            return res.status(200).json(actualizado);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async agregarControlPrenatal(req, res) {
        try {
            const existeid = await SeguimientoEmbarazo.findOne({ controlPrenatal: { $elemMatch: { id_control: Number(req.body.id_control) } } });
            if (existeid) {
                return res.status(404).json({ message: 'id existente por favor ingrese otro' });
            }
            const { id_embarazo, presion_arterial, peso, fecha_control,id_control} = req.body;
            if (!id_embarazo || !fecha_control || id_control == null) {
                return res.status(400).json({ message: 'Datos requeridos incompletos' });
            }

            const nuevo = { presion_arterial, peso, fecha_control,id_control };
            const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
                { id_embarazo: Number(id_embarazo) },
                { $push: { controlPrenatal: nuevo } },
                { returnDocument: 'after', upsert: true }
            );

            return res.status(200).json(actualizado);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

    }

     static async actualizaranalisis(req, res){
    try {
        const { id_embarazo, id_analisis, tipo_analisis, fecha, resultado } = req.body;

        if (!id_embarazo || id_analisis == null) {
            return res.status(400).json({ message: 'Datos requeridos incompletos' });
        }

        let updateFields = {};

        if (tipo_analisis !== undefined) {
            updateFields['analisisClinicos.$.tipo_analisis'] = tipo_analisis;
        }
        if (fecha !== undefined) {
            updateFields['analisisClinicos.$.fecha'] = fecha;
        }
        if (resultado !== undefined) {
            updateFields['analisisClinicos.$.resultado'] = resultado;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar' });
        }

        const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
            { id_embarazo: Number(id_embarazo), 'analisisClinicos.id_analisis': Number(id_analisis) },
            { $set: updateFields },
            { returnDocument: 'after'  }
        );

        if (!actualizado) {
            return res.status(404).json({ message: 'Análisis no encontrado' });
        }

        return res.status(200).json(actualizado);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


static async actualizarultrasonido(req, res){
    try {
        const { id_embarazo, id_ultrasonido, fecha, semanas_estimadas, observaciones } = req.body;

        if (!id_embarazo || id_ultrasonido == null) {
            return res.status(400).json({ message: 'Datos requeridos incompletos' });
        }

        let updateFields = {};

        if (fecha !== undefined) {
            updateFields['ultrasonidos.$.fecha'] = fecha;
        }
        if (semanas_estimadas !== undefined) {
            updateFields['ultrasonidos.$.semanas_estimadas'] = semanas_estimadas;
        }
        if (observaciones !== undefined) {
            updateFields['ultrasonidos.$.observaciones'] = observaciones;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar' });
        }

        const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
            { id_embarazo: Number(id_embarazo), 'ultrasonidos.id_ultrasonido': Number(id_ultrasonido) },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!actualizado) {
            return res.status(404).json({ message: 'Ultrasonido no encontrado' });
        }

        return res.status(200).json(actualizado);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

 static async actualizarcontrolprenatal(req, res){
    try {
        const { id_embarazo, id_control, presion_arterial, peso, fecha_control } = req.body;

        if (!id_embarazo || id_control == null) {
            return res.status(400).json({ message: 'Datos requeridos incompletos' });
        }

        let updateFields = {};

        if (presion_arterial !== undefined) {
            updateFields['controlPrenatal.$.presion_arterial'] = presion_arterial;
        }
        if (peso !== undefined) {
            updateFields['controlPrenatal.$.peso'] = peso;
        }
        if (fecha_control !== undefined) {
            updateFields['controlPrenatal.$.fecha_control'] = fecha_control;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar' });
        }

        const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
            { id_embarazo: Number(id_embarazo), 'controlPrenatal.id_control': Number(id_control) },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!actualizado) {
            return res.status(404).json({ message: 'Control prenatal no encontrado' });
        }

        return res.status(200).json(actualizado);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

    static async eliminarAnalisis(req, res) {
        try {
            const { id_embarazo, id_analisis } = req.body;
            if (!id_embarazo || id_analisis == null) {
                return res.status(400).json({ message: 'Datos requeridos incompletos' });
            }
            const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
                { id_embarazo: Number(id_embarazo) },
                { $pull: { analisisClinicos: { id_analisis: Number(id_analisis) } } },
                { new: true }
            );
            return res.status(200).json(actualizado);
        }catch (error) {
            return res.status(400).json({ message: error.message });
        }   
   }

   static async eliminarUltrasonido(req, res) {
        try {
            const { id_embarazo, id_ultrasonido } = req.body;
            if (!id_embarazo || id_ultrasonido == null) {
                return res.status(400).json({ message: 'Datos requeridos incompletos' });
            }
            const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
                { id_embarazo: Number(id_embarazo) },
                { $pull: { ultrasonidos: { id_ultrasonido: Number(id_ultrasonido) } } },
                { returnDocument: 'after' }
            );
            return res.status(200).json(actualizado);
        }catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    
    static async eliminarControlPrenatal(req, res) {
        try {
            const { id_embarazo, id_control } = req.body;
            if (!id_embarazo || id_control == null) {
                return res.status(400).json({ message: 'Datos requeridos incompletos' });
            }
            const actualizado = await SeguimientoEmbarazo.findOneAndUpdate(
                { id_embarazo: Number(id_embarazo) },
                { $pull: { controlPrenatal: { id_control: Number(id_control) } } },
                { returnDocument: 'after' }
            );
            return res.status(200).json(actualizado);
        }catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }


}
module.exports = seguimientoEmbarazoController;