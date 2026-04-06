const SeguimientoEmbarazo = require('../models/SeguimientoEmbarazo.model');

class SeguimientoEmbarazoController {
    static async registrarSeguimientoEmbarazo(req, res) {
        try { 
            const { fecha, peso, presionArterial, frecuenciaCardiaca, alturaUterina, movimientosFetales, observaciones } = req.body;
            const nuevoSeguimiento = await SeguimientoEmbarazo.obtenerPorId(idSeguimiento);

            if (!nuevoSeguimiento) {
                return res.status(404).json({ message: 'Seguimiento de embarazo no encontrado' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear el seguimiento de embarazo' });
        }

        const nuevoSeguimiento = new SeguimientoEmbarazo({
        idSeguimiento: SeguimientoEmbarazo.idSeguimiento,
        fecha,
        peso,
        presionArterial,
        frecuenciaCardiaca,
        alturaUterina,
        movimientosFetales,
        observaciones
    });
    const seguimientoCreado = await nuevoSeguimiento.save();

    res.status(201).json({
        mensaje: 'Seguimiento de embarazo registrado exitosamente',
        data: seguimientoCreado
    })
}   
}