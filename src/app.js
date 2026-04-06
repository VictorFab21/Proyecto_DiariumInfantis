const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de la API
const citasRoutes = require('./routes/citaMedica.routes');
const embarazoRoutes = require('./routes/embarazo.routes');
const infanteRoutes = require('./routes/infante.routes');

//const usuariosRoutes = require('./routes/usuarios.routes');

app.use('/api/citas', citasRoutes);
app.use('/api/embarazos', embarazoRoutes);
app.use('/api/infantes', infanteRoutes);

//app.use('/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de diariumInfantis híbrida funcionando correctamente'
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Ocurrió un error en el servidor'
    });
})

module.exports = app;



