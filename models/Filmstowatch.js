const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const FilmstowatchSchema = new mongoose.Schema({
// const FilmsToWatchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// const FilmsToWatch = mongoose.model('FilmsToWatch', FilmsToWatchSchema);
// module.exports = FilmsToWatch;
module.exports = mongoose.model('Filmstowatch', FilmstowatchSchema, 'filmstowatch');
