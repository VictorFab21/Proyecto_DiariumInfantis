const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

class AuthController {
    static async login(req, res) {
        try {
            const { correo, contrasenia } = req.body;
            
            if (!correo || !contrasenia) {
                return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
            }
            const usuario = await Usuario.obtenerUsuarioPorCorreo(correo);

             if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const passwordValido = await bcrypt.compare(contrasenia, usuario.contrasenia);
        if (!passwordValido) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre,
            correo: usuario.correo
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
                usuario: {
                id_usuario: usuario.id_usuario,
                nombre_usuario: usuario.nombre,
                correo: usuario.correo,
            }   
        });
        } catch (error) {
            res.status(500).json({
                message: "Error en autenticación",
                error: error.message
            });
        }
        
    }

    static async perfil(req, res) {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
        });
    }
}

module.exports = AuthController;