const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.get('/perfil', verificarToken, AuthController.perfil);
router.post('/login', AuthController.login);

module.exports = router;