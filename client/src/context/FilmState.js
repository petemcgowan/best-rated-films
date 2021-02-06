import React, { createContext, useReducer } from 'react';
import FilmReducer from './FilmReducer';
import axios from 'axios';
import { getEmail } from '../utils/helpers';

// Initial state
const initialState = {
  films: [],
  error: null,
  loading: true
}

// Create context
export const FilmContext = createContext(initialState);

// Provider component
export const FilmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FilmReducer, initialState);

  // Actions
  async function getFilms() {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const res = await axios.post(`/api/films`, {"email": getEmail()}, config);
      console.log("getFilms, res.data.data:" + JSON.stringify(res.data.data));
      calcAverageRankingField(res.data.data);

      dispatch({
        type: 'GET_FILMS',
        payload: res.data.data
      });
    } catch (err) {
      console.log("getFilms, errr:" + err);
      dispatch({
        type: 'FILM_ERROR',
        payload: err.response.data.error
      });
    }
  }



  function calcAverageRankingField (films) {
    // Average Ranking calculations
    var cumulativeRanking = 0;
    var rankingOccurrences = 0;

    films.forEach(film => {
      film.rankings.map((data, key) => {
        if ((data.rank !== undefined) &&
          (data.rank.toLowerCase() !== "todo") &&
          (data.ranker.toLowerCase() !== "other")) {
            cumulativeRanking +=  Number(data.rank);
            rankingOccurrences++;
            }
        return data.rank;
      });
      var averageRanking = ((cumulativeRanking / rankingOccurrences).toFixed(2));
      film["averageRanking"] =  averageRanking;
    });

    // // Sort by average ranking
    function sortJSONArrayByAverageRanking(film1,film2) {
      return film1.averageRanking - film2.averageRanking;
    }
    films.sort(sortJSONArrayByAverageRanking);
  }

  async function deleteFilm(_id) {
    try {
      console.log ("deleteFilm (aka films \"to watch\") called with id:" + JSON.stringify(_id));

      await axios.delete(`/api/films/${_id}`);

      dispatch({
        type: 'DELETE_FILM',
        payload: _id
      });
    } catch (err) {
      console.log("deleteFilm, errr:" + err);
      dispatch({
        type: 'FILM_ERROR',
        payload: err.response.data.error
      });
    }
  }

  async function addFilm(title, email) {

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      console.log ("addFilm, title," + title + ", email" +  email );
      const res = await axios.post('/api/films/addFilm', { title, email }, config);
      console.log ("addFilm, after post" + JSON.stringify(res.data.data));

      dispatch({
        type: 'ADD_FILM',
        payload: res.data.data
      });
      console.log ("addFilm, after dispatch");
    } catch (err) {
      console.log("addFilm, errr:" + err);
      dispatch({
        type: 'FILM_ERROR',
        payload: err.response.data.error
      });
    }
  }

  return (<FilmContext.Provider value={{
    films: state.films,
    error: state.error,
    loading: state.loading,
    getFilms,
    deleteFilm,
    addFilm
  }}>
    {children}
  </FilmContext.Provider>);
}
