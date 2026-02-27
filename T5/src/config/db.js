const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri); 
    console.log('Conectado a mongoDB');
  } catch (error) {
    console.error('Error al conectar a mongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
