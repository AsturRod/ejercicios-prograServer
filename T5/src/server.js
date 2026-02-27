require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start(){

    await connectDB(MONGODB_URI);

    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}

start().catch(err => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});

