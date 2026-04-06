const db = require("../config/mysql");

const buscarUsuarioPorCorreo = async (correo) => {
    const [rows] = await db.query(
        "SELECT * FROM Usuario WHERE correo = ?",
        [correo]
    );

    return rows[0];
};

module.exports = {
    buscarUsuarioPorCorreo
};