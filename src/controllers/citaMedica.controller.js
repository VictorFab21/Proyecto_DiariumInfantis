const CitaMedica = require('../models/citaMedica.model');

class CitaMedicaController {
    // Obtener todoas las citas médicas
    static async obtenerCitaMedica(req, res) {
        try {
            const citas = await CitaMedica.obtenerTodo();
            if (citas.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron citas médicas"
                });
            }
            res.json(citas);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener la cita médica",
                error: error.message
            });
        }
    }

    // Crear nueva cita médica
    static async crearCita (req, res) {
        try {
            const nuevaCita = await CitaMedica.crearCita(req.body);

            res.status(201).json({
                mensaje: "Cita médica creada correctamente",
                data: nuevaCita
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear cita",
                error: error.message
            });
        }
    }

    // Buscar por ID
    static async buscarCitaPorId(req, res) {
        try {
            const cita = await CitaMedica.buscarPorId(req.params.id);
            if(!cita){
                return res.status(404).json({
                    mensaje: "Cita no encontrada"
                });
            }
            res.json({
                data: cita,
                mensaje: "Cita encontrada"
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al buscar cita",
                error: error.message
            });
        }
    }

    // Cancelar cita
    static async cancelarCita(req, res) {
        try {
            const resultado =await CitaMedica.cancelarCita(req.params.id);
            if(!resultado){
                return res.status(404).json({
                    message: "Cita no encontrada"
                });
            }
            res.json({
                mensaje: "Cita cancelada correctamente"
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al cancelar cita",
                error: error.message
            });
        }
    }

    // Actualizar cita
    static async actualizarCita(req, res) {
        try {
            const resultado = await CitaMedica.actualizarCita(req.params.id, req.body);

            if(!resultado){
                return res.status(404).json({
                    mensaje: "Cita no encontrada"
                });
            }
            res.status(200).json({
                mensaje: "Cita actualizada correctamente"
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar cita",
                error: error.message
            });
        }
    }

    // Buscar cita por fecha
   static async buscarCitaMedica(req, res) {
    try {
        const { fecha } = req.query;

        if (!fecha) {
            return res.status(400).json({
                mensaje: "Debes proporcionar una fecha"
            });
        }

        const citas = await CitaMedica.buscarPorFecha(fecha);

        if (citas.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron citas para la fecha proporcionada"
            });
        }

        return res.json(citas);

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al obtener citas",
            error: error.message
        });
    }}
}

module.exports = CitaMedicaController;