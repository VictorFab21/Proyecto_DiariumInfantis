const express = require('express');
const router = express.Router();
const seguimientoEmbarazoController = require('../controllers/seguimientoEmbarazo.controller');

router.post('/', seguimientoEmbarazoController.createSeguimientoEmbarazo);
router.get('/', seguimientoEmbarazoController.buscararchivo);
router.post('/analisis', seguimientoEmbarazoController.agregarAnalisis);
router.post('/ultrasonido', seguimientoEmbarazoController.agregarUltrasonido);
router.post('/controlPrenatal', seguimientoEmbarazoController.agregarControlPrenatal);
router.put('/analisis', seguimientoEmbarazoController.actualizaranalisis);
router.put('/ultrasonido', seguimientoEmbarazoController.actualizarultrasonido);
router.put('/controlPrenatal', seguimientoEmbarazoController.actualizarcontrolprenatal);
router.delete('/analisis', seguimientoEmbarazoController.eliminarAnalisis);
router.delete('/ultrasonido', seguimientoEmbarazoController.eliminarUltrasonido);
router.delete('/controlPrenatal', seguimientoEmbarazoController.eliminarControlPrenatal);
module.exports = router;