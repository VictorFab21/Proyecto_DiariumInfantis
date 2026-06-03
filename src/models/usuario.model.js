const {mysqlPool} = require('../config/mysql');
const bcrypt = require('bcryptjs');

class Usuario {
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query('SELECT * FROM usuario');
        return rows;
    }

//Crear usuario
    static async crear(data){
        const{
            nombre,
            apellido,
            correo,
            contrasenia,
            telefono
        } = data;

        const passwordHash = await bcrypt.hash(contrasenia, 10);

        const [result] = await mysqlPool.query(`
        INSERT INTO usuario(
        nombre,
        apellido,
        correo,
        contrasenia,
        telefono
        )
        VALUES(?,?,?,?,?)
        ` ,[nombre, apellido, correo, passwordHash, telefono]);

        return {
            id_usuario: result.insertId
        }
    } 

    static async actualizarUsuario(id, data){
        try {
            const allowedFields = ["nombre", "apellido", "correo", "contrasenia", "telefono"];

            // Filtra y valida campos
            const filteredData = Object.keys(data)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => {
                    obj[key] = data[key];
                    return obj;
                }, {});

            // Hash si viene contraseña
            if (filteredData.contrasenia) {
                filteredData.contrasenia = await bcrypt.hash(filteredData.contrasenia, 10);
            }

            // Nada que actualizar
            if (Object.keys(filteredData).length === 0) {
                return { affectedRows: 0, changedRows: 0 };
            }

            const [result] = await mysqlPool.query(`
                UPDATE Usuario
                SET ?
                WHERE id_usuario = ?`, 
                [filteredData, id]);

            return result;

        } catch (error) {
            throw new Error('Error al actualizar el usuario: ' + error);
        }
    }

    static async obtenerUsuarioPorCorreo(correo){
        const [rows] = await mysqlPool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
        return rows[0] || null;
    }
}
module.exports = Usuario;