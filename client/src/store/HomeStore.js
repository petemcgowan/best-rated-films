// import { top20 } from "../data/top20";
import { observable, action, decorate, runInAction } from "mobx";
import axios from "axios";
// import { FilmContext } from "../context/FilmState";
// import FilmReducer from "./FilmReducer";
import { getEmail } from "../utils/helpers";
const html = document.querySelector("html");

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let random = randomNumber(0, 20);

class HomeStore {
  // static contextType = FilmContext;

  pageResults = [];
  films = [];
  loaded = false;
  currentPage = 1;
  vintageMode = false;

  async fetchFilms() {
    runInAction(() => {
      this.loaded = false;
    });

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("fetchFilms has been called");

      console.log("fetchFilms, getEmail():" + getEmail());
      const res = await axios.post(
        `/api/films`,
        { email: getEmail(), vintageMode: this.vintageMode },
        config
      );
      // console.log("fetchFilms, res.data.data" + JSON.stringify(res.data.data));
      // this.calcAverageRankingField(res.data.data);
      // console.log(
      //   "fetchFilms, , after calcAverageRankingField" +
      //     JSON.stringify(res.data.data)
      // );
      this.setFilms(res.data.data);
      // console.log("fetchFilms, after setFilms" + JSON.stringify(res.data.data));

      // calcAverageRankingField(res.data.data);
    } catch (err) {
      console.log("fetchFilms, errr:" + err);
    }
  }

  // async setMovieDetails(
  //   filmId,
  //   movieDbId,
  //   poster_path,
  //   release_date,
  //   backdrop_path
  // ) {
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     // Pete: todo add a preprocessor in these kinds of logs (throughout) as this output will affect production speed
  //     console.log(
  //       "setMovieDetails, filmId:" +
  //         filmId +
  //         ", movieDbId:" +
  //         movieDbId +
  //         ", poster_path:" +
  //         poster_path +
  //         ", release_date:" +
  //         release_date +
  //         ", backdrop_path:" +
  //         backdrop_path
  //     );
  //     const res = await axios.put(
  //       `/api/films/${filmId}`,
  //       { movieDbId, poster_path, release_date, backdrop_path },
  //       config
  //     );
  //     console.log(
  //       "setMovieDetails, after post" + JSON.stringify(res.data.data)
  //     );

  //     // dispatch({
  //     //   type: "SET_MOVIE_DETAILS",
  //     //   payload: {
  //     //     movieDbId: movieDbId,
  //     //     poster_path: poster_path,
  //     //     release_date: release_date,
  //     //     backdrop_path: backdrop_path,
  //     //   },
  //     // });
  //     console.log("setMovieDetails, after dispatch");
  //   } catch (err) {
  //     console.log("setMovieDetails, errr:" + err);
  //     // dispatch({
  //     //   type: "FILM_ERROR",
  //     //   payload: err.response.data.error,
  //     // });
  //   }
  // }

  async getPageResults(page, triggerRefresh) {
    runInAction(() => {
      this.loaded = false;
    });

    console.log("getPageResults, films.length:" + this.films.length);
    console.log("getPageResults, triggerRefresh:" + triggerRefresh);

    // let topFilmsArray = {
    //   page: page,
    //   results: [],
    // };
    this.pageResults = [];
    // const apiKey = "4e182d5acda98a333464c4252dc9c195";
    // if (
    //   this.films === null ||
    //   this.films === undefined ||
    //   this.films.length === 0
    // ) {
    //   console.log ("getPageResults has no films, so it's getting them")
    //   await this.fetchFilms();
    // }
    // console.log("Films BEFORETRIGGER/SORT" + JSON.stringify(this.films));
    if (
      this.films === null ||
      this.films === undefined ||
      this.films.length === 0 ||
      triggerRefresh // we want the films straight from the DB
    ) {
      console.log("getPageResults has no films, so it's getting them");
      await this.fetchFilms(this.vintageMode);
    }
    // const arrayOfMovieDbIds = [
    //   348, 857, 13, 194, 1091, 62, 28, 578, 261909, 792, 603, 680, 769, 443129,
    //   238, 1578, 240, 510, 840, 15,
    // ];

    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // clear this array everytime
    console.log("getPageResults, page:" + page);
    // TODO: this is gonna be an issue when you run out of films*20 and there's like 12 left or such (put a check in so the max checks against what's left vs page etc).
    const pageFilmStart = (page - 1) * 20; // 20, 40, 60
    let pageFilmEnd = page * 20; // 20, 40, 60
    if (pageFilmEnd > this.films.length) pageFilmEnd = this.films.length;
    console.log(
      "getPageResults, pageFilmStart:" +
        pageFilmStart +
        ", pageFilmEnd:" +
        pageFilmEnd +
        ", this.films.length:" +
        this.films.length
    );
    // console.log("this.films.results:" + JSON.stringify(this.films));
    // TEMPORARY TO GET backdrop image etc
    for (let index = pageFilmStart; index < pageFilmEnd; index++) {
      // for (let index = pageFilmStart; index < 216; index++) {
      // console.log("this.films[index]:" + JSON.stringify(this.films[index]));

      // const movieDbId = this.films[index].movieDbId;
      // const averageRanking = this.films[index].averageRanking;
      // console.log("averageRanking:" + JSON.stringify(averageRanking));
      // const response = await axios.get(
      //   `https://api.themoviedb.org/3/movie/${movieDbId}?api_key=${apiKey}&language=en-US`,
      //   config
      // );
      // response.data.averageRanking = averageRanking;

      // results.push(response.data);
      this.pageResults.push(this.films[index]);
      // console.log(
      //   "getPageResults, response.data:" + JSON.stringify(response.data)
      // );

      // this.setMovieDetails(
      //   this.films[index].filmId, // film id (not films to watch id)
      //   response.data.id,
      //   response.data.poster_path,
      //   response.data.release_date,
      //   response.data.backdrop_path
      // );
    }

    // console.log("results:" + JSON.stringify(results));
    //pageResults = results;
    // console.log("topFilmsArray after:" + JSON.stringify(topFilmsArray));

    return (
      this.setPageResults(this.pageResults),
      this.pageResults[random]
        ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.pageResults[random].backdrop_path})
        center center / cover no-repeat fixed`)
        : null
    );
  }

  // fetchTop100(page) {
  //   runInAction(() => {
  //     this.loaded = false;
  //   });
  //   const apiKey = "4e182d5acda98a333464c4252dc9c195";

  //   // Pete todo obviously this will be replaced with the "20 array loop"
  //   fetch(
  //     `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       return (
  //         this.setTop100(top20),
  //         this.top100.results[random]
  //           ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.top100.results[random].backdrop_path})
  //           center center / cover no-repeat fixed`)
  //           : null
  //       );
  //     });
  // }

  calcAverageRankingField(films) {
    // Average Ranking calculations
    var cumulativeRanking = 0;
    var rankingOccurrences = 0;

    films.forEach((film) => {
      // console.log("calcAverageRankingField:" + JSON.stringify(film));
      film.rankings.map((data, key) => {
        if (
          data.rank !== undefined &&
          data.rank.toLowerCase() !== "todo" &&
          data.ranker.toLowerCase() !== "other"
        ) {
          cumulativeRanking += Number(data.rank);
          rankingOccurrences++;
        }
        return data.rank;
      });
      var averageRanking = (cumulativeRanking / rankingOccurrences).toFixed(2);
      film["averageRanking"] = averageRanking;
    });

    // // Sort by average ranking
    function sortJSONArrayByAverageRanking(film1, film2) {
      return film1.averageRanking - film2.averageRanking;
    }
    films.sort(sortJSONArrayByAverageRanking);
  }

  setFilms(data) {
    this.films = data;
  }

  setPageResults(data) {
    this.pageResults = data;
    this.loaded = true;
  }
}

decorate(HomeStore, {
  pageResults: observable,
  films: observable,
  // search: observable,
  currentPage: observable,
  vintageMode: observable,
  // term: observable,
  setFilms: action,
  setPageResults: action,
  // setSearch: action,
  loaded: observable,
});

const homeStore = new HomeStore();

export default homeStore;
