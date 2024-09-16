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

      const encodedURIString = encodeURI(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${film.title}&include_adult=false&title=${film.title}`
      );
      console.log("getMovieDbId, encodedURIString:" + encodedURIString);
      const res = await axios.get(
        encodedURIString,
        config
      );

      // Find the earliest exact match from the search results (only one!)
      let earliestReleaseDate = null;
      var movieDbId = -1;

      for (const value of res.data.results) {
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

      // update films db table with movie id
      updateMovieDbId(
        film.filmId,
        movieDbId,
        film.poster_path,
        film.backdrop_path,
        film.release_date
      ); // film id (not films to watch)

    } catch (err) {
      console.error("getMovieDbId, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function getFilms(vintageMode) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `/api/films`,
        { email: getEmail(), vintageMode: vintageMode },
        config
      );

      dispatch({
        type: "GET_FILMS",
        payload: res.data.data,
      });
    } catch (err) {
      console.error("getFilms, errr:" + err);
      dispatch({
        type: "FILM_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  async function deleteFilm(_id) {
    try {
      await axios.delete(`/api/films/${_id}`);

      dispatch({
        type: "DELETE_FILM",
        payload: _id,
      });
    } catch (err) {
      console.error("deleteFilm, errr:" + err);
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
      const res = await axios.post(
        "/api/films/addFilm",
        { title, email },
        config
      );

      dispatch({
        type: "ADD_FILM",
        payload: res.data.data,
      });
    } catch (err) {
      console.error("addFilm, errr:" + err);
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

      const res = await axios.put(
        `/api/films/${filmId}`,
        { movieDbId, poster_path, release_date, backdrop_path },
        config
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
    } catch (err) {
      console.error("setMovieDetails, errr:" + err);
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

      const res = await axios.put(
        `/api/films/${filmId}`,
        { movieDbId },
        config
      );

      dispatch({
        type: "SET_MOVIE_DETAILS",
        payload: { filmId: filmId, movieDbId: movieDbId },
      });
    } catch (err) {
      console.error("updateMovieDbId, errr:" + err);
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
