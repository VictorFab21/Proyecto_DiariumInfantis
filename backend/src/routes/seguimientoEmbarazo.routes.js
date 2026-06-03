const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const seguimientoEmbarazoController = require('../controllers/seguimientoEmbarazo.controller');

router.post('/', verificarToken, seguimientoEmbarazoController.createSeguimientoEmbarazo);
router.get('/', verificarToken, seguimientoEmbarazoController.buscararchivo);
router.post('/analisis', verificarToken, seguimientoEmbarazoController.agregarAnalisis);
router.post('/ultrasonido', verificarToken, seguimientoEmbarazoController.agregarUltrasonido);
router.post('/controlPrenatal', verificarToken, seguimientoEmbarazoController.agregarControlPrenatal);
router.put('/analisis', verificarToken, seguimientoEmbarazoController.actualizaranalisis);
router.put('/ultrasonido', verificarToken, seguimientoEmbarazoController.actualizarultrasonido);
router.put('/controlPrenatal', verificarToken, seguimientoEmbarazoController.actualizarcontrolprenatal);
router.delete('/analisis', verificarToken, seguimientoEmbarazoController.eliminarAnalisis);
router.delete('/ultrasonido', verificarToken, seguimientoEmbarazoController.eliminarUltrasonido);
router.delete('/controlPrenatal', verificarToken, seguimientoEmbarazoController.eliminarControlPrenatal);

module.exports = router;