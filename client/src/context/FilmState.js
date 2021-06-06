import React, { createContext, useReducer } from "react";
import FilmReducer from "./FilmReducer";
import axios from "axios";
import { getEmail } from "../utils/helpers";

// Initial state
const initialState = {
  films: [],
  error: null,
  loading: true,
  currentPage: 1,
};

// Create context
export const FilmContext = createContext(initialState);

// Provider component
export const FilmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FilmReducer, initialState);

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
      updateMovieDbId(film.filmId, movieDbId); // film id (not films to watch)

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

  async function getFilms() {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(`/api/films`, { email: getEmail() }, config);
      // console.log("getFilms, res.data.data:" + JSON.stringify(res.data.data));
      calcAverageRankingField(res.data.data);

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

  function calcAverageRankingField(films) {
    // Average Ranking calculations
    var cumulativeRanking = 0;
    var rankingOccurrences = 0;

    films.forEach((film) => {
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
        type: "UPDATE_MOVIE_DB_ID",
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
        getFilms,
        getMovieDbId,
        deleteFilm,
        addFilm,
        updateMovieDbId,
      }}
    >
      {children}
    </FilmContext.Provider>
  );
};
