const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado', error: error.message });
    }
}   

module.exports = verificarToken;