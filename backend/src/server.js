require('dotenv').config();

const app = require('./app');
const connectMongo = require('./config/mongo');
const { connectMySQL } = require('./config/mysql');
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {

    try {
        await connectMySQL();
        console.log("MySQL conectado");
    } catch (error) {
        console.log("MySQL no conectado");
        console.log(error.message);
    }


    try {
        await connectMongo();
        console.log("MongoDB conectado");
    } catch (error) {
        console.log("MongoDB no conectado");
        console.log(error.message);
    }


    app.listen(PORT, () => {
        console.log("Servidor ejecutándose en puerto " + PORT);
    });

}

iniciarServidor();