const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
router.get('/perfil', verificarToken, AuthController.perfil);



module.exports = router;