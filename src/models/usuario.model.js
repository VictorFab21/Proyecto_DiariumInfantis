const {mysqlPool} = require("../config/mysql");

class Usuario{
    //Obtener todos los usuarios
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
    }=data;

const [result] = await mysqlPool.query(`
    INSERT INTO usuario(
    nombre,
    apellido,
    correo,
    contrasenia,
    telefono
    )
    VALUES(?,?,?,?,?)
    ` ,[nombre,apellido, correo,contrasenia,telefono]);

    return {id_usuario:result.insertId};
    }
// 
static async actualizar(data){
        const{
            nombre,
            apellido,
            correo,
            contrasenia,
            telefono,
        } = data;

        const [result] = await mysqlPool.query(`
            UPDATE usuario
            SET nombre = ?, apellido = ?, correo = ?, contrasenia = ?, telefono = ?
            WHERE id_usuario = ?
        `, [nombre, apellido, correo, contrasenia, telefono, id_usuario]);
        
        return result;
    }
}

const buscarUsuarioPorCorreo = async (correo) => {
    const [rows] = await mysqlPool.query(
        "SELECT * FROM usuario WHERE correo = ?",
        [correo]
    );

    return rows[0];
};
module.exports = {
    Usuario,
    buscarUsuarioPorCorreo
};