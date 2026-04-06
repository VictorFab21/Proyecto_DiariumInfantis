const express = require('express');
const router = express.Router();

const EmbarazoController = require('../controllers/embarazo.controller');

// Rutas para embarazo
router.get('/', EmbarazoController.obtenerEmbarazos);
router.post('/', EmbarazoController.crearEmbarazo);
router.put('/:id', EmbarazoController.actualizarEmbarazo);
router.get('/usuario/:id_usuario', EmbarazoController.buscarEmbarazoUsaurioID);
router.get('/:id', EmbarazoController.buscarEmbarazoPorID);

module.exports = router;