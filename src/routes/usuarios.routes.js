const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/usuario.controller');

// Rutas para usuario
router.post('/', UsuarioController.crearUsuario);
router.get('/', UsuarioController.obtenerTodos);

module.exports = router;