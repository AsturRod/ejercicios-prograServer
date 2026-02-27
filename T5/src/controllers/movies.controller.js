const fs = require('fs');
const path = require('path');
const Movie = require('../models/Movie');

// Helper para borrar archivo de carátula
function deleteCoverFile(filename) {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', '..', process.env.UPLOADS_DIR || 'uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error borrando carátula antigua', err);
    }
  });
}

// GET /api/movies?genre=&page=&limit=&search=
async function getMovies(req, res, next) {
  try {
    const { genre, page = 1, limit = 10, search } = req.query;

    const filter = {};
    if (genre) {
      filter.genre = genre;
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [movies, total] = await Promise.all([
      Movie.find(filter).skip(skip).limit(Number(limit)),
      Movie.countDocuments(filter),
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      results: movies,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/movies/available
async function getAvailableMovies(req, res, next) {
  try {
    const movies = await Movie.find({ availableCopies: { $gt: 0 } });
    res.json(movies);
  } catch (error) {
    next(error);
  }
}

// GET /api/movies/:id
async function getMovieById(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
}

// POST /api/movies
async function createMovie(req, res, next) {
  try {
    const data = req.body;
    const movie = new Movie(data);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: error.errors });
    }
    next(error);
  }
}

// PUT /api/movies/:id
async function updateMovie(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    const movie = await Movie.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    
    res.json(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: error.errors });
    }
    next(error);
  }
}

// DELETE /api/movies/:id
async function deleteMovie(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Borrar carátula asociada si existe
    if (movie.cover) {
      deleteCoverFile(movie.cover);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// PATCH /api/movies/:id/rent
async function rentMovie(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    if (movie.availableCopies === 0) {
      return res.status(400).json({ message: 'No hay copias disponibles para alquilar' });
    }

    movie.availableCopies -= 1;
    movie.timesRented += 1;
    await movie.save();

    res.json(movie);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/movies/:id/return
async function returnMovie(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    if (movie.availableCopies < movie.copies) {
      movie.availableCopies += 1;
    }

    await movie.save();

    res.json(movie);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/movies/:id/cover
async function uploadCover(req, res, next) {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha enviado ninguna imagen' });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      // Si no existe la película, borrar el archivo recién subido
      deleteCoverFile(req.file.filename);
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Si ya había carátula, eliminarla
    if (movie.cover) {
      deleteCoverFile(movie.cover);
    }

    movie.cover = req.file.filename;
    await movie.save();

    res.json({
      message: 'Carátula subida correctamente',
      cover: movie.cover,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/movies/:id/cover
async function getCover(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie || !movie.cover) {
      return res.status(404).json({ message: 'Carátula no encontrada' });
    }

    const filePath = path.join(__dirname, '..', '..', process.env.UPLOADS_DIR || 'uploads', movie.cover);
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}

// GET /api/movies/stats/top
async function getTopMovies(req, res, next) {
  try {
    const movies = await Movie.find().sort({ timesRented: -1 }).limit(5);
    res.json(movies);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMovies,
  getAvailableMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  rentMovie,
  returnMovie,
  uploadCover,
  getCover,
  getTopMovies,
};
