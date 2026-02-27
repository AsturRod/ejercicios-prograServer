const express = require ('express');
const morgan = require('morgan');
const path = require('path');
const moviesRoutes = require('./routes/movies.routes');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Estaticos de las caratulas
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//Rutas de la API
app.use('/api/movies', moviesRoutes);

// Middleware para manejo basico de errores
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: err.message || 'Error Interno del Servidor' });
});

module.exports = app;