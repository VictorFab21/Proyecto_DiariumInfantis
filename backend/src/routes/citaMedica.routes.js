const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const CitaMedicaController = require('../controllers/citaMedica.controller');

// Rutas para cita médica
router.get('/', CitaMedicaController.obtenerCitaMedica);
router.post('/', CitaMedicaController.crearCita);
router.get('/id/:id', CitaMedicaController.buscarCitaPorId);
router.delete('/:id', CitaMedicaController.cancelarCita);
router.put('/:id', CitaMedicaController.actualizarCita);
router.get('/fecha/', CitaMedicaController.buscarCitaMedica);

module.exports = router;