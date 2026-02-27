const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const GENRES = ['action', 'comedy', 'drama', 'horror', 'scifi'];

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, minlenght: 2, trim: true },
    director: { type: String, required: true, trim: true },
    year: { type: Number, min: 1888, max: currentYear, required: true},
    genre: { type: String, required: true, enum: GENRES},
    copies:{ type: Number, min: 0, default: 5 },
    availableCopies:{ type: Number, min: 0},
    timesRented:{ type: Number, min: 0, default: 0 },
    cover:{ type: String, default:null},
}, {
    timestamps: true
});

// Middleware para asegurar que availableCopies se inicialice correctamente y no exceda el número de copias
movieSchema.pre('save', function(next){
    if(this.isNew && (this.availableCopies === undefined || this.availableCopies === null)){
        this.availableCopies = this.copies;
    }

    if(this.availableCopies > this.copies){
        this.availableCopies = this.copies;
    }
    next();
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;


