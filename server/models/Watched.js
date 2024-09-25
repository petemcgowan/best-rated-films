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

module.exports = mongoose.model('Watched', WatchedSchema, 'watched');