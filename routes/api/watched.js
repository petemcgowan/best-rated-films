const express = require("express");
const router = express.Router();
const Film = require("../../models/Film");
const Watched = require("../../models/Watched");

module.exports = router;

// @desc    Get all watched
router.post("/", async (req, res, next) => {
  try {
    console.log("post/getWatched, req.body:" + JSON.stringify(req.body));
    const { email } = req.body;

    // get Films (for additional film info)
    var films = await Film.find();

    const watched = await Watched.find({ email: email }).exec();

    var augmentedFilms = [];
    for (var i = 0; i < watched.length; i++) {
      films.forEach((film) => {
        if (film.title === watched[i].title) {
          watched[i].poster_path = film.poster_path;

          var augFilmObj = {
            _id: watched[i]._id,
            filmId: film._id, // this is the film _id, for clarity calling filmId in CODE
            email: watched[i].email,
            title: watched[i].title,
            year: film.year,
            director: film.director,
            poster_path: film.poster_path,
            backdrop_path: film.backdrop_path,
            averageRanking: film.averageRanking,
            release_date: film.release_date,
            movieDbId: film.movieDbId,
            rankings: film.rankings,
          };
          augmentedFilms.push(augFilmObj);
        } // if matched
      }); // for each film
    } // for watched
    return res.status(200).json({
      success: true,
      count: augmentedFilms.length,
      data: augmentedFilms,
    });
  } catch (err) {
    console.error(`post/getWatched: err:${err}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Add watched
router.post("/addWatched", async (req, res, next) => {
  try {
    console.log("addWatched, req.body:" + JSON.stringify(req.body));
    const { title, email } = req.body;
    const film = await Watched.create(req.body);

    return res.status(201).json({
      success: true,
      data: film,
    });
  } catch (err) {
    console.error(`addWatched:err:${err}`);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
});

// @desc    Delete watched
router.delete("/:id", async (req, res, next) => {
  try {
    console.log("deleteWatched, req.body:" + JSON.stringify(req.body));
    const watched = await Watched.findById(req.params.id);

    if (!watched) {
      return res.status(404).json({
        success: false,
        error: "No watched found",
      });
    }

    await watched.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(`deleteWatched:err:${err}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});
