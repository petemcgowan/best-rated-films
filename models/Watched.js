const mongoose = require('mongoose');

const WatchedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// const Watched = mongoose.model('Watched', WatchedSchema, 'watched');
// module.exports = Watched;
module.exports = mongoose.model('Watched', WatchedSchema, 'watched');