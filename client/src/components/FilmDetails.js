import React, { useContext } from 'react';
import { FilmContext } from '../context/FilmState';
import { WatchedContext } from '../context/WatchedState';

export const FilmDetails = ({ film }) => {

   const { deleteFilm } = useContext(FilmContext);
   const { addWatched } = useContext(WatchedContext);

  return (

    <tr onClick={ () => {
      deleteFilm(film._id);
      addWatched(film.title, film.email);
    }}>
    {/* <button className="delete-btn">x</button> */}
    <td className="artists">{film.title}
    </td>
    <td className="releaseName">{film.rankings.map(function (rrr) {
      if (rrr.ranker === "AFI") {
        return rrr.rank;
      } else {
        return null
      }
    })}</td>
    <td className="releaseName">{film.rankings.map(function (rrr) {
      if (rrr.ranker === "Empire") {
        return rrr.rank;
      } else {
        return null
      }
    })}</td>
    <td className="releaseName">{film.rankings.map(function (rrr) {
      if (rrr.ranker === "Hollywood Reporter") {
        return rrr.rank;
      } else {
        return null
      }
    })}</td>
    <td className="releaseName">{film.rankings.map(function (rrr) {
      if (rrr.ranker === "IMDB") {
        return rrr.rank;
      } else {
        return null
      }
    })}</td>
    <td className="releaseName">{(film.averageRanking)}</td>
  </tr>
  );
}

