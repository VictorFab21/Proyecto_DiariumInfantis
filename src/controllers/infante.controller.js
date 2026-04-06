const infante = require('../models/infante.model');

class InfanteController {
    // Obtener todos los infantes
    static async obtenerInfante(req, res) {
        try {
            const infantes = await infante.obtenerTodo();
            if (infantes.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron infantes"
                });
            }
            res.json(infantes);

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los infantes",
                error: error.message
            });
        }
    }
}

module.exports = InfanteController;