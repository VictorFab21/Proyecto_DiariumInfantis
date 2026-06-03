const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const EmbarazoController = require('../controllers/embarazo.controller');

// Rutas para embarazo
router.get('/', verificarToken, EmbarazoController.obtenerEmbarazos);
router.post('/', verificarToken, EmbarazoController.crearEmbarazo);
router.put('/:id', verificarToken, EmbarazoController.actualizarEmbarazo);
router.get('/usuario/:id_usuario', verificarToken, EmbarazoController.buscarEmbarazoUsaurioID);
router.get('/:id', verificarToken, EmbarazoController.buscarEmbarazoPorID);

module.exports = router;