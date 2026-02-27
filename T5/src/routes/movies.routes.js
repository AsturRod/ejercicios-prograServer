const express = require('express');
const upload = require('../config/multer');
const controller = require('../controllers/movies.controller');

const router = express.Router();

//Disponibles primero
router.get('/available', controller.getAvailableMovies);

//Top 5 más alquiladas
router.get('stats/top', controller.getTopMovies);

//Listar películas
router.get('/', controller.getMovies);

//Crear nueva película
router.post('/', controller.createMovie);

//Obtener película por ID
router.get('/:id', controller.getMovieById);

//Actualizar película
router.put('/:id', controller.updateMovie);

//Eliminar película
router.delete('/:id', controller.deleteMovie);

//Alquilar película
router.patch('/:id/rent', controller.rentMovie);

//Devolver película
router.patch('/:id/return', controller.returnMovie);

//Subir carátula
router.post('/:id/cover', upload.single('cover'), controller.uploadCover);

//Obtener carátula
router.get('/:id/cover', controller.getCover);

// Top 5 más alquiladas
router.get('/stats/top', controller.getTopMovies);

// Subir/reemplazar carátula
router.patch('/:id/cover', upload.single('cover'), controller.uploadCover);

// Obtener imagen de carátula
router.get('/:id/cover', controller.getCover);



module.exports = router;
