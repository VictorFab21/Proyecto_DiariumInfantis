const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const UsuarioController = require('../controllers/usuario.controller');

router.post('/crear', UsuarioController.crearUsuario);
router.get('/', verificarToken, UsuarioController.obtenerTodos);
router.get('/:correo', verificarToken, UsuarioController.obtenerUsuarioporCorreo);
router.put('/actualizar/:id', verificarToken, UsuarioController.actualizarUsuario);

module.exports = router;