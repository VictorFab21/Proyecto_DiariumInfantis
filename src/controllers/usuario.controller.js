const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario.model");


class UsuarioController {
    // Obtener todos los usuarios
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
    // Crear usuario
    static async crearUsuario(req,res){
        try{
            const nuevoUsuario = await Usuario.crear(req.body);

            res.status(201).json({
                mensaje:"Usuario creado correctamente",
                data:nuevoUsuario
            })
        }catch(error){
            res.status(500).json({
                mensaje:"Error al crear usuario",
                error:error.message
            });
        }            
    }
}
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const usuario = await Usuario.buscarUsuarioPorCorreo(correo);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        res.status(200).json({
            mensaje: "Autenticación correcta",
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error en autenticación",
            error: error.message
        });
    }
});

module.exports = router;
module.exports = UsuarioController;