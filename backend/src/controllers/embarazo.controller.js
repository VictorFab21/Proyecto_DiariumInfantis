const Embarazo = require('../models/embarazo.model');

class EmbarazoController {

    // Obtener todos los embarazos
    static async obtenerEmbarazos(req, res) {
        try {
            const emabarazos = await Embarazo.obtenerTodo();

            if (!emabarazos || emabarazos.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron embarazos"
                });
            }
            res.json(emabarazos);
        } catch (error) {
            console.error('Error al obtener los embarazos: ' + error.message);
            res.status(500).json({ error: 'Ocurrió un error en el servidor' });
        }
    }

    // Crear nuevo embarazo
    static async crearEmbarazo(req, res) {
        try {
            const nuevoEmbarazo = await Embarazo.crearEmbarazo(req.body);

            res.status(201).json({
                mensaje: "Embarazo creado correctamente",
                data: nuevoEmbarazo
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear el embarazo",
                error: error.message
            });
        }
    }

    // Modificar embarazo
    static async actualizarEmbarazo(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const resultado = await Embarazo.modificarEmbarazo(id, data);

            // Verificar si se actualizó algún registro
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "Embarazo no encontrado"
                });
            }

            if (resultado.changedRows === 0) {
                return res.status(200).json({
                    mensaje: "No se realizaron cambios en el embarazo"
                });
            }

            res.status(200).json({
                mensaje: "Embarazo actualizado correctamente"
            });

        } catch (error) {
            res.status(500).json({
                error: "Error al actualizar el embarazo"
            });
        }
    }

    // Buscar embarazo por ID
    static async buscarEmbarazoPorID(req, res) {
        try {
            const { id } = req.params;
            const embarazo = await Embarazo.buscarEmbarazoID(id);

            if (!embarazo) {
                return res.status(404).json({
                    mensaje: "Embarazo no encontrado"
                });
            }
            res.json(embarazo);
        }catch (error) {
            res.status(500).json({ error: 'Ocurrió un error en el servidor' });
        }
    }

    // Buscar embarazo por ID de usuario
    static async buscarEmbarazoUsaurioID(req, res) {
        try {
            const { id_usuario } = req.params;
            const embarazos = await Embarazo.buscarEmbarazoUsuarioID(id_usuario);

            if (!embarazos || embarazos.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron embarazos para este usuario"
                });
            }
            
            res.json(embarazos);

        } catch (error) {
            res.status(500).json({ 
                error: 'Ocurrió un error en el servidor',
                error: error.message
            });
        }
    }
}
module.exports = EmbarazoController;