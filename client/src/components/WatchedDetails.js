import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { FilmContext } from "../context/FilmState";
import { WatchedContext } from "../context/WatchedState";
const nullw500 = require("../images/nullw500.png");

export const WatchedDetails = ({ changePage, currentPage, watchedFilm }) => {
  const { deleteWatched } = useContext(WatchedContext);
  const { addFilm } = useContext(FilmContext);

  return (
    <div
      className="movie-item infos-container"
      key={watchedFilm._id}
      // onClick={() => {
      //   deleteWatched(watchedFilm._id);
      //   addFilm(watchedFilm.title, watchedFilm.email);
      //   changePage(currentPage, true); // trigger the Page Results component to re-render
      // }}
    >
      <Link
        to={`/movie/${watchedFilm.movieDbId}`}
        // disabled={isSending}
        // onClick={scrollTop}
      >
        <img
          src={
            watchedFilm.poster_path
              ? `https://image.tmdb.org/t/p/w500${watchedFilm.poster_path}`
              : `${nullw500}`
          }
          alt={`Movie Poster`}
        />
        <div className="infos-box">
          <div className="infos-one">{watchedFilm.release_date}</div>
          <div className="infos-two">{watchedFilm.title}</div>
          <div className="infos-three">{watchedFilm.averageRanking}</div>
        </div>
      </Link>

      <div className="title">{watchedFilm.title}</div>
      <div>
        <button
          // disabled={isSending}
          onClick={() => {
            deleteWatched(watchedFilm._id);
            // addFilm(watchedFilm.title, watchedFilm.email);
            changePage(currentPage, true); // trigger the Page Results component to re-render
          }}
        >
          Recirculate
        </button>
      </div>
    </div>
  );
};
