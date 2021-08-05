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
    console.log("getFilms, vintageMode:" + JSON.stringify(vintageMode));
    console.log("getFilms, email:" + JSON.stringify(email));
    // this is the core per-user films table
    // I'm sorting by average Ranking

    var filmsToWatch = await Filmstowatch.find({ email: email }).exec();
    // console.log("films API:filmsToWatch:" + JSON.stringify(filmsToWatch));
    // combine to get Films
    // Pete todo: should i combine films/filmsToWatch query?  and also add  ".sort("averageRanking")" so sorting is done in the query...
    const vintageDate = new Date("1/1/1968");
    var filteredFilms = [];
    for (var i = 0; i < filmsToWatch.length; i++) {
      films.forEach((film) => {
        if (film.title === filmsToWatch[i].title) {
          const releaseCompareDate = new Date(film.release_date);
          if (vintageMode || releaseCompareDate > vintageDate) {
            console.log(
              "Adding film title:" +
                film.title +
                ", compare:" +
                (releaseCompareDate > vintageDate)
            );
            // console.log(
            //   // "Match found (before reassign), film._id:" +
            //   JSON.stringify(film._id)
            // );
            var newFilmObj = {
              _id: filmsToWatch[i]._id,
              filmId: film._id, // this is the film _id, for clarity calling filmId in CODE
              email: filmsToWatch[i].email,
              title: filmsToWatch[i].title,
              year: film.year,
              director: film.director,
              poster_path: film.poster_path,
              backdrop_path: film.backdrop_path,
              averageRanking: film.averageRanking,
              release_date: film.release_date,
              movieDbId: film.movieDbId,
              rankings: film.rankings,
            };

            filteredFilms.push(newFilmObj);
            // filmsToWatch[i] = newFilmObj;
            // console.log("filmsToWatch[i]:" + JSON.stringify(filmsToWatch[i]));
          } // end vintage compare
        }
      });
    }
    console.log(
      "films controller, filteredFilms.length:" + filteredFilms.length
    );
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
    console.log("getFilms, err:" + err);
    console.log("getFilms, err.log:" + err.log);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// @desc    Add film
router.post("/addFilm", async (req, res, next) => {
  try {
    console.log("addFilm, req.body:" + JSON.stringify(req.body));
    const { title, email } = req.body;
    console.log("addFilm, title:" + title + ", email:" + email);

    const filmToWatch = await Filmstowatch.create(req.body);
    console.log(
      "addFilm, after Filmstowatch create:" + JSON.stringify(filmToWatch)
    );

    // augment the filmToWatch with film data
    var film = await Film.find({ title: title }).exec();
    console.log("addFilm, after film retrieve:" + JSON.stringify(film));
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
    console.log(
      "addFilm, after newFilmObj create, newFilmObj:" +
        JSON.stringify(newFilmObj)
    );
    return res.status(201).json({
      success: true,
      data: newFilmObj,
    });
  } catch (err) {
    console.log("addFilm, errrr:" + err);
    console.log("addFilm, errrr.log:" + err.log);
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
    console.log("update PUT, id:" + JSON.stringify(id));

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
        console.log();
        if (err) {
          console.log("ERROR PAth" + JSON.stringify(err));
          // res.send(err)
        } else {
          console.log("RESULT PAth" + JSON.stringify(result));
          // res.send(result)
        }
      }
    );

    return res.status(201).json({
      success: true,
      data: { id },
    });
  } catch (err) {
    console.log("update PUT, errrr:" + err);
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
  // exports.deleteFilm = async (req, res, next) => {
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
    console.log("Delete Film, after film remove:");

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log("deleteFilm, errrr:" + err);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});
