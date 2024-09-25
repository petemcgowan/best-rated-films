const express = require("express");
const router = express.Router();
const Film = require("../../models/Film");
const Filmstowatch = require("../../models/Filmstowatch");

module.exports = router;

// @desc    Get all films
router.post("/", async (req, res, next) => {
  try {
    // get Films (filmRankings)
    var films = await Film.find();

    const { email, vintageMode } = req.body;
    // this is the core per-user films table
    // I'm sorting by average Ranking

    var filmsToWatch = await Filmstowatch.find({ email: email }).exec();
    // combine to get Films
    const vintageDate = new Date("1/1/1968");
    var filteredFilms = [];
    for (var i = 0; i < filmsToWatch.length; i++) {
      films.forEach((film) => {
        if (film.title === filmsToWatch[i].title) {
          const releaseCompareDate = new Date(film.release_date);
          if (vintageMode || releaseCompareDate > vintageDate) {
            var newFilmObj = {
              _id: filmsToWatch[i]._id,
              filmId: film._id, // this is the film _id, for clarity calling filmId in CODE
              email: filmsToWatch[i].email,
              title: filmsToWatch[i].title,
              year: film.release_date.toLocaleDateString("en-us", {
                year: "numeric",
              }),
              director: film.director,
              poster_path: film.poster_path,
              backdrop_path: film.backdrop_path,
              averageRanking: film.averageRanking,
              release_date: film.release_date,
              movieDbId: film.movieDbId,
              rankings: film.rankings,
            };

            filteredFilms.push(newFilmObj);
          } // end vintage compare
        }
      });
    }

    // // Sort by average ranking
    function sortJSONArrayByAverageRanking(film1, film2) {
      return film1.averageRanking - film2.averageRanking;
    }
    filteredFilms.sort(sortJSONArrayByAverageRanking);

    return res.status(200).json({
      success: true,
      count: filteredFilms.length,
      data: filteredFilms,
    });
  } catch (err) {
    console.error(`getFilms, err: ${err}, err.log: ${err.log}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Add film
router.post("/addFilm", async (req, res, next) => {
  try {
    console.log("addFilm called, req.body:" + JSON.stringify(req.body));
    const { title, email } = req.body;

    const filmToWatch = await Filmstowatch.create(req.body);

    // augment the filmToWatch with film data
    var film = await Film.find({ title: title }).exec();
    var newFilmObj = {
      _id: filmToWatch._id, //this is "films to Watch" Id
      email: filmToWatch.email,
      title: filmToWatch.title,
      year: film[0].year,
      movieDbId: film[0].movieDbId,
      poster_path: film[0].poster_path,
      averageRanking: film[0].averageRanking,
      backdrop_path: film[0].backdrop_path,
      release_date: film[0].release_date,
      filmId: film[0]._id, // NOT the "filmstowatch" id, film id, renaming here for 'clarity'
      director: film[0].director,
      rankings: film[0].rankings,
    };
    return res.status(201).json({
      success: true,
      data: newFilmObj,
    });
  } catch (err) {
    console.error(`addFilm, err: ${err}`);
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

// @desc    Update film  (movieDbId in this case)
router.put("/:id", async (req, res, next) => {
  try {
    console.log("update PUT, req.body:" + JSON.stringify(req.body));
    const {
      movieDbId,
      poster_path,
      averageRanking,
      release_date,
      backdrop_path,
    } = req.body;

    const id = req.params.id;

    // Update Movie ID in the database
    // Film.findByIdAndUpdate(id, movieDbId, { useFindAndModify: false });

    Film.findByIdAndUpdate(
      id,
      {
        movieDbId: movieDbId,
        poster_path: poster_path,
        averageRanking: averageRanking,
        release_date: release_date,
        backdrop_path: backdrop_path,
      },
      // { useFindAndModify: false },
      function (err, result) {
        if (err) {
          console.error("ERROR PAth" + JSON.stringify(err));
          // res.send(err)
        } else {
          console.error("RESULT PAth" + JSON.stringify(result));
          // res.send(result)
        }
      }
    );

    return res.status(201).json({
      success: true,
      data: { id },
    });
  } catch (err) {
    console.error("update PUT, errrr:" + err);
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

// @desc    Delete film
router.delete("/:id", async (req, res, next) => {
  try {
    console.log("Delete Film, req.params.id:" + JSON.stringify(req.params.id));
    const film = await Filmstowatch.findById(req.params.id);

    if (!film) {
      return res.status(404).json({
        success: false,
        error: "No film found",
      });
    }

    await film.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(`deleteFilm, err:${err}:`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});
