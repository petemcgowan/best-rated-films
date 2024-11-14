const express = require("express");
const router = express.Router();
const Film = require("../../models/Film");
const Filmstowatch = require("../../models/Filmstowatch");
const Watched = require("../../models/Watched");

module.exports = router;

// @desc    Get all films
router.post("/", async (req, res, next) => {
  try {
    // get Films (filmRankings)
    var films = await Film.find();

    const { email, vintageMode } = req.body;
    console.log(`email:${email}, vintageMode:${vintageMode}`)
    const vintageDate = new Date("1/1/1968");
    // var filmsToWatch = await Filmstowatch.find({ email: email }).exec();

    // Pete mod block
    const watched = await Watched.find({ email: email }).exec();

    // filter watchedFromFilms
    var unwatchedFilms = films.filter((element) => {
      let found = false
      const releaseCompareDate = new Date(element.release_date);
      for (let i = 0; i < watched.length; i++) {
        if ((element.title === watched[i].title)) {
          console.log(`Watched film:element.title`)
          return false
        }
      }
      if (vintageMode && releaseCompareDate < vintageDate) {
        return false
      }
    return true
    })

    console.log (`unwatchedFilms.length:${unwatchedFilms.length}`)

    // // Sort by average ranking
    function sortJSONArrayByAverageRanking(film1, film2) {
      return film1.averageRanking - film2.averageRanking;
    }
    unwatchedFilms.sort(sortJSONArrayByAverageRanking);

    return res.status(200).json({
      success: true,
      count: unwatchedFilms.length,
      data: unwatchedFilms,
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
// router.delete("/:id", async (req, res, next) => {
//   try {
//     console.log("Delete Film, req.params.id:" + JSON.stringify(req.params.id));
//     const film = await Filmstowatch.findById(req.params.id);

//     if (!film) {
//       return res.status(404).json({
//         success: false,
//         error: "No film found",
//       });
//     }

//     await film.remove();

//     return res.status(200).json({
//       success: true,
//       data: {},
//     });
//   } catch (err) {
//     console.error(`deleteFilm, err:${err}:`);
//     return res.status(500).json({
//       success: false,
//       error: "Server Error",
//     });
//   }
// });
