const mongoose = require('mongoose');

const FilmstowatchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Filmstowatch', FilmstowatchSchema, 'filmstowatch');
