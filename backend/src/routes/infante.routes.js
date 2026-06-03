const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const InfanteController = require('../controllers/infante.controller');

// Rutas para infante
router.get('/', InfanteController.obtenerInfante);
router.get('/filtro', InfanteController.buscarInfante);
router.post('/', InfanteController.crearInfante);

module.exports = router;