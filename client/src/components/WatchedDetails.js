import React, { useContext } from "react";
import { FilmContext } from "../context/FilmState";
import { WatchedContext } from "../context/WatchedState";

export const WatchedDetails = ({ changePage, currentPage, watchedFilm }) => {
  const { deleteWatched } = useContext(WatchedContext);
  const { addFilm } = useContext(FilmContext);

  return (
    <li
      onClick={() => {
        deleteWatched(watchedFilm._id);
        addFilm(watchedFilm.title, watchedFilm.email);
        changePage(currentPage, true); // trigger the Page Results component to re-render
      }}
    >
      <div className="title">{watchedFilm.title}</div>
      <button className="delete-btn">x</button>
    </li>
  );
};
