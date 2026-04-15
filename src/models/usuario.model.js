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
    ` ,[nombre,apellido, correo,contrasenia,telefono]
    );

return {
    id_usuario:result.insertId
}
} 
// 
static async actualizar(data){
    const[rows]= await mysqlPool.query(`
     SELECT
        
        `)
}
}

const buscarUsuarioPorCorreo = async (correo) => {
    const [rows] = await mysqlPool.query(
        "SELECT * FROM Usuario WHERE correo = ?",
        [correo]
    );

    return rows[0];
};
module.exports = {
    buscarUsuarioPorCorreo
};
module.exports = Usuario;