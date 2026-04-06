const { mysqlPool } = require('../config/mysql');

class CitaMedica {

    // Obtener todas las citas
    static async obtenerTodo() {
        try {
            const [rows] = await mysqlPool.query(`
                SELECT
                    id_cita,
                    fecha_cita,
                    motivo,
                    advertencia,
                    nombre_doctor,
                    fecha_proxCita,
                    id_usuariofk
                FROM CitaMedica
                ORDER BY id_cita ASC
            `);
            return rows;

        } catch (error) {
            console.error('Error al obtener las citas médicas: ' + error.message);
            throw error;
        }
    }

    // Crear cita médica
    static async crearCita(data) {
        try {
            const {
                fecha_cita,
                motivo,
                advertencia,
                nombre_doctor,
                fecha_proxCita,
                id_usuariofk
            } = data;

            const [result] = await mysqlPool.query(`
                INSERT INTO CitaMedica (
                    fecha_cita,
                    motivo,
                    advertencia,
                    nombre_doctor,
                    fecha_proxCita,
                    id_usuariofk
                )
            VALUES (?, ?, ?, ?, ?, ?)
            `, [
                fecha_cita,
                motivo,
                advertencia,
                nombre_doctor,
                fecha_proxCita,
                id_usuariofk
            ]);

            return {
                id_cita: result.insertId,
                fecha_cita,
                motivo,
                advertencia,
                nombre_doctor,
                fecha_proxCita,
                id_usuariofk
            };
        } catch (error) {
            console.error('Error al crear la cita médica: ' + error.message);
            throw error;
        }
    }

    // Buscar cita por ID
    static async buscarPorId(id) {
        const [rows] = await mysqlPool.query(`
            SELECT *
            FROM CitaMedica
            WHERE id_cita = ?
            `, [id]);
        return rows[0];
    }

    // Cancelar cita (eliminar)
    static async cancelarCita(id) {
        const [result] = await mysqlPool.query(`
            DELETE FROM CitaMedica
            WHERE id_cita = ?
            `, [id]);
            
        return result;
    }
    // Modificar cita
    static async actualizarCita(id, data) {
        const {
            fecha_cita,
            motivo,
            advertencia,
            nombre_doctor,
            fecha_proxCita
        } = data;

        const [result] = await mysqlPool.query(`
            UPDATE CitaMedica
            SET
                fecha_cita = ?,
                motivo = ?,
                advertencia = ?,
                nombre_doctor = ?,
                fecha_proxCita = ?
            
            WHERE id_cita = ?`,
            [fecha_cita, motivo, advertencia, nombre_doctor, fecha_proxCita, id ]);
        
        return result;
    }
   
    // Buscar citas por fecha
    static async buscarPorFecha(fecha) {
        const [rows] = await mysqlPool.query(`
            SELECT *
            FROM CitaMedica
            WHERE DATE(fecha_cita) = ?
            `, [fecha]);
        return rows;
    }
}

module.exports = CitaMedica;
