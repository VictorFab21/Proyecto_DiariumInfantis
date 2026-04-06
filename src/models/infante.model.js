const {mysqlPool} = require('../config/mysql');

class Infante {
    // Obtener todos los infantes
    static async obtenerTodo() {
        try {
            const[rows] = await mysqlPool.query(`
                SELECT * FROM Infante
                ORDER BY id_infante
                `);
                return rows; // Devolver todos los resultados disponibles.
        } 
        catch (error) {
            console.error('Error al obtener los infantes: ' + error.message);
        }
    }
}

module.exports = Infante;