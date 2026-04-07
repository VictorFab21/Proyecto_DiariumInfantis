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
     // Buscar infante
    static async buscarInfante(req, res) {
        try {
            const filtros = req.query;

            if (!filtros.nombre && !filtros.id_infante) {
                return res.status(400).json({
                    mensaje: "Se requiere al menos un filtro (id_infante o nombre)"
                });
            }

            const resultado = await infante.buscarInfante(filtros);

            if (resultado.length === 0) {
                return res.status(404).json ({
                    mensaje: "No se encontraron resultados"
                });
            }
            res.json(resultado);

        } catch (error) {

            res.status(500).json ({
            mensaje: "Error al buscar",
            error: error.message
            });
        }
    }
    // Crear nuevo infante
    static async crearInfante(req, res) {
        try {
            const nuevoInfante = await infante.crearInfante(req.body);
            
            res.status(201).json ({
                mensaje: "Infante creado correctamente",
                data: nuevoInfante
            })
        } 
        catch (error) {
            res.status(500).json ({
                mensaje: "Error al crear el infante",
                error: error.message
            });
        }
    }
}

module.exports = InfanteController;