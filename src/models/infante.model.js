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

    // Buscar por id o nombre
    static async buscarInfante(filtros) {
        let query = `SELECT * FROM Infante WHERE 1=1`;
        const valores = [];

        if (filtros.id_infante) {
            query += " AND id_infante = ?";
            valores.push(filtros.id_infante);
        }
        if (filtros.nombre) {
            query += " AND nombre LIKE ?";
            valores.push(`%${filtros.nombre}%`);
        }
        query += " ORDER BY id_infante";

        try {
            const [rows] = await mysqlPool.query(query, valores);
            return rows;
        } catch (error) {
            console.error('Error al buscar infante: ' + error.message);
        }
    }
    // Crear nuevo infante
    static async crearInfante(data) {
        try {
            const {
                nombre,
                peso,
                fecha_fecundacion,
                genero,
                fecha_nacimiento,
                id_embarazofk
            } = data;
            const [result] = await mysqlPool.query(`
                INSERT INTO Infante (
                    nombre,
                    peso,
                    fecha_fecundacion,
                    genero,
                    fecha_nacimiento,
                    id_embarazofk)
                VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        nombre,
                        peso,
                        fecha_fecundacion,
                        genero,
                        fecha_nacimiento,
                        id_embarazofk
                ])
            return {
                id_infante: result.insertId,
                nombre,
                peso,
                fecha_fecundacion,
                genero,
                fecha_nacimiento,
                id_embarazofk
            };     
        } catch (error) {
            console.error('Error al crear el infante: ' + error.message);
            throw error;
        }

    }
}

module.exports = Infante;