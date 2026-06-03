const Usuario = require('../models/usuario.model');

class UsuarioController {
    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            res.json(usuarios);
        }
        catch (error) {
            console.error('Error al obtener usuarios:', error.message);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }
    
    static async crearUsuario(req, res) {
    try {
        const { nombre, apellido, correo, contrasenia, telefono } = req.body;

        // Validación
        if (!nombre || !correo || !contrasenia) {
            return res.status(400).json({ mensaje: "Nombre, correo y contraseña son obligatorios" });
        }

        // Verificar duplicados
        const usuarioExistente = await Usuario.obtenerUsuarioPorCorreo(correo);
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        // Crear usuario
        const nuevoUsuario = await Usuario.crear({
            nombre,
            apellido,
            correo,
            contrasenia,
            telefono
        });

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            data: nuevoUsuario
        });

        } catch (error) {
            res.status(500).json({
            mensaje: "Error al crear usuario",
            error: error.message
            });
        }
    }

    static async obtenerUsuarioporCorreo(req,res){
        try{
            const usuario = await Usuario.obtenerUsuarioPorCorreo(req.params.correo);
            if(!usuario){
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }
            res.json(usuario);
        }catch(error){
            res.status(500).json({
                mensaje:"Error al obtener usuario",
                error:error.message
            });
        }
    }

    static async actualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            // validar correo
            if (data.correo) {
                const usuarioExistente = await Usuario.obtenerUsuarioPorCorreo(data.correo);

                if (usuarioExistente && usuarioExistente.id_usuario !== parseInt(id)) {
                    return res.status(400).json({ mensaje: "El correo ya está registrado por otro usuario" });
                }
            }

            const resultado = await Usuario.actualizarUsuario(id, data);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            if (resultado.changedRows === 0) {
                return res.status(200).json({ mensaje: 'No se realizaron cambios' });
            }

            res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar usuario",
                error: error.message
            });
        }
    }
}

module.exports = UsuarioController;