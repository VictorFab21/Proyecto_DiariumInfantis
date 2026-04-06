const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario.model");

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