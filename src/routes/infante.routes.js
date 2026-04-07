const express = require('express');
const router = express.Router();

const InfanteController = require('../controllers/infante.controller');

// Rutas para infante
router.get('/', InfanteController.obtenerInfante);
router.get('/filtro', InfanteController.buscarInfante);

module.exports = router;