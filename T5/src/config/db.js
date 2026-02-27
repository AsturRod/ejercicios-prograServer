const mongoose = require('mongoose');

async function connectDB(mongoUri) {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a mongoDB');
    } catch (error) {
        console.error('Error al conectar a mongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;