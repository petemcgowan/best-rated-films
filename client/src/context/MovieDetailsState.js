import React, { createContext, useReducer } from "react";
import MovieDetailsReducer from "./MovieDetailsReducer";
import axios from "axios";

// Initial state
const initialState = {
  movieDetails: [],
  error: null,
  loading: true,
};

const html = document.querySelector("html");

// Create context
export const MovieDetailsContext = createContext(initialState);

// Provider component
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(MovieDetailsReducer, initialState);
  const apiKey = "4e182d5acda98a333464c4252dc9c195";

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
      console.log("encodedURIString:" + encodedURIString);
      const res = await axios.get(encodedURIString, config);
      console.log(
        "MovieDetailsContext/State, getMovieDetails():" + JSON.stringify(res)
      );

      // fetch(
      //   `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
      // )
      //   .then((res) => res.json())
      //   .then((res) => {
      //     return (
      //       this.setDetails(res),
      //       this.details
      //         ? (html.style.background = `url(https://image.tmdb.org/t/p/w1280${this.details.backdrop_path})
      //             center center / cover no-repeat fixed`)
      //         : null
      //     );
      //   });
    } catch (err) {
      console.log("getMovieDetails, err:" + err);
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
