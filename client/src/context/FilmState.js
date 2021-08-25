import React, { createContext, useReducer } from "react";
import FilmReducer from "./FilmReducer";
import axios from "axios";
import { getEmail, randomNumber } from "../utils/helpers";
// import { top20 } from "../data/top20";

let random = randomNumber(0, 20);
const html = document.querySelector("html");

// Initial state
const initialState = {
  films: [],
  error: null,
  loading: true,
  currentPage: 1,
  pageResults: [],
  loaded: false,
};

// Create context
export const FilmContext = createContext(initialState);

// Provider component
export const FilmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FilmReducer, initialState);

  async function setCurrentPage(page) {
    dispatch({
      type: "SET_CURRENT_PAGE",
      payload: page,
    });
  }

  // async function getPageResults(page, triggerRefresh, vintageMode) {
  //   this.loaded = false;
  //   console.log("getPageResults, films.length:" + this.films.length);

  //   this.pageResults = [];
  //   if (
  //     this.films === null ||
  //     this.films === undefined ||
  //     this.films.length === 0 ||
  //     triggerRefresh // we want the films array from the DB
  //   )
  //     await this.fetchFilms(vintageMode);
  //   console.log("getPageResults, page:" + page);
  //   const pageFilmStart = (page - 1) * 20; // 20, 40, 60
  //   let pageFilmEnd = page * 20; // 20, 40, 60
  //   if (pageFilmEnd > this.films.length) pageFilmEnd = this.films.length;
  //   console.log(
  //     "getPageResults, pageFilmStart:" +
  //       pageFilmStart +
  //       ", pageFilmEnd:" +
  //       pageFilmEnd +
  //       ", this.films.length:" +
  //       this.films.length
  //   );
  //   for (let index = pageFilmStart; index < pageFilmEnd; index++) {
  //     this.pageResults.push(this.films[index]);
  //   }

  //   return (
  //     this.setPageResults(this.pageResults),
  //     this.pageResults[random]
  //       ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.pageResults[random].backdrop_path})
  //       center center / cover no-repeat fixed`)
  //       : null
  //   );
  // }

  async function setPageResults(pageResults) {
    dispatch({
      type: "SET_TOP100",
      payload: pageResults,
    });
  }

  // Actions
  async function getMovieDbId(film) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const apiKey = "4e182d5acda98a333464c4252dc9c195";
      // const res = await axios.post(`/api/films`, { email: getEmail() }, config);

      const encodedURIString = encodeURI(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${film.title}&include_adult=false&title=${film.title}`
      );
      console.log("encodedURIString:" + encodedURIString);
      const res = await axios.get(
        encodedURIString,
        // { email: getEmail() },
        config
      );
      console.log(
        "getMovieDbId, res:" + JSON.stringify(res)
        // "getMovieDbId, res.data.data:" + JSON.stringify(res.data.data)
      );

      // Find the earliest exact match from the search results (only one!)
      let earliestReleaseDate = null;
      var movieDbId = -1;

      for (const value of res.data.results) {
        console.log(
          "release_date:" + value.release_date,
          ", title:" + value.title + ", movieDbId:" + value.id
        );

        // title match (ignoring case and accents and such)
        if (
          value.title.trim().localeCompare(film.title.trim(), "en", {
            sensitivity: "accent",
            ignorePunctuation: true,
          }) === 0
        ) {
          let movieDate = new Date(value.release_date);
          if (earliestReleaseDate == null) {
            earliestReleaseDate = movieDate;
            movieDbId = value.id;
          }
          // set the earliest release date and currentMovieID (if there is one)
          if (earliestReleaseDate > movieDate) {
            movieDbId = value.id;
            earliestReleaseDate = movieDate;
          }
        }
      } // end for
      console.log(
        "earliestReleaseDate:" +
          earliestReleaseDate +
          ", movieDbId:" +
          movieDbId
      );

      // update films db table with movie id
      updateMovieDbId(
        film.filmId,
        movieDbId,
        film.poster_path,
        film.backdrop_path,
        film.release_date
      ); // film id (not films to watch)

      // dispatch({
      //   type: "GET_MOVIE_DETAILS",
      //   payload: res.data.data,
      // });
    } catch (err) {
      console.log("getMovieDbId, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // async function getTop100(page) {
  //   state.loaded = false;
  //   const apiKey = "4e182d5acda98a333464c4252dc9c195";

  //   // fetch(
  //   //   `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
  //   // )
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   console.log("getTop100, getEmail():" + getEmail());
  //   const res = await axios
  //     .post(`/api/films`, { email: getEmail() }, config)
  //     // .then((res) => res.json())   //assuming i don't need this
  //     .then((res) => {
  //       console.log("res:" + JSON.stringify(res));
  //       console.log("this.films:" + JSON.stringify(this.films));
  //       this.films = res.data.data;
  //       // console.log("top20:" + JSON.stringify(top20));
  //       console.log("page:" + JSON.stringify(page));
  //       // const fetchData = async () => {
  //       // await getFilms();
  //       // };
  //       // fetchData();
  //       dispatch({
  //         type: "GET_TOP100",
  //         payload: this.films,
  //       });
  //       return (
  //         this.setTop100(this.films),
  //         state.films[random]
  //           ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.films[random].backdrop_path})
  //             center center / cover no-repeat fixed`)
  //           : null
  //       );
  //     });
  // }

  async function getFilms(vintageMode) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log("FILMSTATE, getFilms, getEmail():" + getEmail());
      const res = await axios.post(
        `/api/films`,
        { email: getEmail(), vintageMode: vintageMode },
        config
      );
      // console.log("getFilms, res.data.data:" + JSON.stringify(res.data.data));
      // calcAverageRankingField(res.data.data);

      dispatch({
        type: "GET_FILMS",
        payload: res.data.data,
      });
    } catch (err) {
      console.log("getFilms, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // function calcAverageRankingField(films) {
  //   // Average Ranking calculations
  //   var cumulativeRanking = 0;
  //   var rankingOccurrences = 0;

  //   films.forEach((film) => {
  //     film.rankings.map((data, key) => {
  //       if (
  //         data.rank !== undefined &&
  //         data.rank.toLowerCase() !== "todo" &&
  //         data.ranker.toLowerCase() !== "other"
  //       ) {
  //         cumulativeRanking += Number(data.rank);
  //         rankingOccurrences++;
  //       }
  //       return data.rank;
  //     });
  //     var averageRanking = (cumulativeRanking / rankingOccurrences).toFixed(2);
  //     film["averageRanking"] = averageRanking;
  //   });

  //   // // Sort by average ranking
  //   function sortJSONArrayByAverageRanking(film1, film2) {
  //     return film1.averageRanking - film2.averageRanking;
  //   }
  //   films.sort(sortJSONArrayByAverageRanking);
  // }

  async function deleteFilm(_id) {
    try {
      console.log(
        'deleteFilm (aka films "to watch") called with id:' +
          JSON.stringify(_id)
      );

      await axios.delete(`/api/films/${_id}`);

      dispatch({
        type: "DELETE_FILM",
        payload: _id,
      });
    } catch (err) {
      console.log("deleteFilm, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function addFilm(title, email) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("addFilm, title," + title + ", email" + email);
      const res = await axios.post(
        "/api/films/addFilm",
        { title, email },
        config
      );
      console.log("addFilm, after post" + JSON.stringify(res.data.data));

      dispatch({
        type: "ADD_FILM",
        payload: res.data.data,
      });
      console.log("addFilm, after dispatch");
    } catch (err) {
      console.log("addFilm, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function setMovieDetails(
    filmId,
    movieDbId,
    poster_path,
    release_date,
    backdrop_path
  ) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Pete: todo add a preprocessor in these kinds of logs (throughout) as this output will affect production speed
      console.log(
        "setMovieDetails, filmId:" +
          filmId +
          ", movieDbId:" +
          movieDbId +
          ", poster_path:" +
          poster_path +
          ", release_date:" +
          release_date +
          ", backdrop_path:" +
          backdrop_path
      );
      const res = await axios.put(
        `/api/films/${filmId}`,
        { movieDbId, poster_path, release_date, backdrop_path },
        config
      );
      console.log(
        "setMovieDetails, after post" + JSON.stringify(res.data.data)
      );

      dispatch({
        type: "SET_MOVIE_DETAILS",
        payload: {
          movieDbId: movieDbId,
          poster_path: poster_path,
          release_date: release_date,
          backdrop_path: backdrop_path,
        },
      });
      console.log("setMovieDetails, after dispatch");
    } catch (err) {
      console.log("setMovieDetails, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function updateMovieDbId(filmId, movieDbId) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Pete: todo add a preprocessor in these kinds of logs (throughout) as this output will affect production speed
      console.log(
        "updateMovieDbId, filmId:" + filmId + ", movieDbId:" + movieDbId
      );
      const res = await axios.put(
        `/api/films/${filmId}`,
        { movieDbId },
        config
      );
      console.log(
        "updateMovieDbId, after post" + JSON.stringify(res.data.data)
      );

      dispatch({
        type: "SET_MOVIE_DETAILS",
        payload: { filmId: filmId, movieDbId: movieDbId },
      });
      console.log("updateMovieDbId, after dispatch");
    } catch (err) {
      console.log("updateMovieDbId, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  return (
    <FilmContext.Provider
      value={{
        films: state.films,
        error: state.error,
        loading: state.loading,
        currentPage: state.currentPage,
        loaded: state.loaded,
        pageResults: state.pageResults,
        getFilms,
        setCurrentPage,
        // getPageResults,
        setPageResults,
        getMovieDbId,
        deleteFilm,
        addFilm,
        updateMovieDbId,
        setMovieDetails,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
