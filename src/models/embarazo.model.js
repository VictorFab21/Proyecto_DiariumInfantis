const { mysqlPool } = require('../config/mysql');

class Embarazo {
    // Obtener todos los embarazos
    static async obtenerTodo() {
        try {
            const [rows] = await mysqlPool.query(`
                SELECT
                    id_embarazo,
                    ultima_menstruacion,
                    semana_gestacion,
                    fecha_probable,
                    id_usuariofk
                FROM Embarazo
                ORDER BY id_embarazo
                `
            );
            return rows;
            
        } catch (error) {
            console.error('Error al obtener los embarazos: ' + error.message);
            throw error;
        }
    }

    // Crear embarazo
    static async crearEmbarazo(data) {
        try {
            const {
                ultima_menstruacion,
                semana_gestacion,
                fecha_probable,
                id_usuariofk
            } = data;
            const [result] = await mysqlPool.query(`
                INSERT INTO Embarazo (
                    ultima_menstruacion,
                    semana_gestacion,
                    fecha_probable,
                    id_usuariofk) 
                VALUES (?, ?, ?, ?)
                `, [
                    ultima_menstruacion,
                    semana_gestacion,
                    fecha_probable,
                    id_usuariofk
                ])
            return {
                id_embarazo: result.insertId,
                ultima_menstruacion,
                semana_gestacion,
                fecha_probable,
                id_usuariofk
            };
        } catch (error) {
            console.error('Error al crear el embarazo: ' + error.message);
            throw error;
        }
    }

    // Modificar embarazo
    static async modificarEmbarazo(id, data){
        try {
            const {
                ultima_menstruacion,
                semana_gestacion,
                fecha_probable,
                id_usuariofk
            } = data;
            const [result] =await mysqlPool.query(`
                UPDATE Embarazo 
                SET 
                    ultima_menstruacion = ?,
                    semana_gestacion = ?,
                    fecha_probable = ?,
                    id_usuariofk = ?
                WHERE id_embarazo = ?
                `, [
                    ultima_menstruacion,
                    semana_gestacion,
                    fecha_probable,
                    id_usuariofk,
                    id
                ]);

                // verificar si se actualizó algún registro
                if (result.affectedRows === 0) {
                    console.log(result);
                    return null; // No se encontró el embarazo para actualizar;
                }

            return result;

            } catch (error) {
                console.error('Error al modificar el embarazo: ' + error.message);
                throw error;
        }
    }

    // Buscar embarazo por ID
    static async buscarEmbarazoID(id) {
        const [rows] = await mysqlPool.query(`
            SELECT *
            FROM Embarazo
            WHERE id_embarazo = ?
            `, [id]);
        return rows[0]; // Devolver solo el primer resultado
    }

    // Buscar embarazo por ID de usuario
    static async buscarEmbarazoUsuarioID(id_usuario) {
        const [rows] = await mysqlPool.query(`
            SELECT * FROM Embarazo
            WHERE id_usuariofk = ?
            `, [id_usuario]);
        return rows; // Devolver todos los resultados
    }
}
module.exports = Embarazo;