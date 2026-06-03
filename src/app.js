const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de la API
const usuariosRoutes = require('./routes/usuarios.routes');
const authRoutes = require('./routes/auth.routes');
const citasRoutes = require('./routes/citaMedica.routes');
const embarazoRoutes = require('./routes/embarazo.routes');
const infanteRoutes = require('./routes/infante.routes');
const seguimientoEmbarazo = require('./routes/seguimientoEmbarazo.routes'); 

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/embarazos', embarazoRoutes);
app.use('/api/infantes', infanteRoutes);
app.use('/api/seguimiento-embarazo', seguimientoEmbarazo);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de diariumInfantis híbrida funcionando correctamente'
    });
});

app.get('/api/seguimiento-embarazo', seguimientoEmbarazo);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Ocurrió un error en el servidor'
    });
})

module.exports = app;



