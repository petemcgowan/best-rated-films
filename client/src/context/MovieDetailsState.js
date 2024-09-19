import React, { createContext, useReducer } from "react";
import MovieDetailsReducer from "./MovieDetailsReducer";
import axios from "axios";

// Initial state
const initialState = {
  movieDetails: [],
  error: null,
  loading: true,
};

// Create context
export const MovieDetailsContext = createContext(initialState);

// Provider component
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MovieDetailsReducer, initialState);

  const apiKey = process.env.REACT_APP_API_KEY;

  async function getMovieDetails(film) {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const encodedURIString = encodeURI(
        `https://api.themoviedb.org/3/movie/${film.movieDbId}?api_key=${apiKey}&language=en-US`
      );
      console.error("getMovieDetails, encodedURIString:" + encodedURIString);
      const res = await axios.get(encodedURIString, config);
    } catch (err) {
      console.error("getMovieDetails, err:" + err);
      dispatch({
        type: "MOVIE_DETAILS_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  return (
    <MovieDetailsContext.Provider
      value={{
        movieDetails: state.movieDetails,
        error: state.error,
        loading: state.loading,
        getMovieDetails,
      }}
    >
      {children}
    </MovieDetailsContext.Provider>
  );
};
