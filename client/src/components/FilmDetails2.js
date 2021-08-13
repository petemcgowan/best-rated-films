import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { FilmContext } from "../context/FilmState";
import { WatchedContext } from "../context/WatchedState";
import { Link } from "react-router-dom";
import homeStore from "../store/HomeStore";
const nullw500 = require("../images/nullw500.png");

// const dotenv = require("dotenv");

export const FilmDetails2 = ({ film, scrollTop, changePage }) => {
  const { deleteFilm } = useContext(FilmContext);
  const { addWatched } = useContext(WatchedContext);
  const [isSending, setIsSending] = useState(false);
  const isMounted = useRef(true);
  const { pageResults, films, loaded, currentPage, vintageMode } = homeStore;

  //const { scrollTop } = props;
  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const sendRequest = useCallback(async () => {
    // don't send again while we are sending
    if (isSending) return;
    // update state
    setIsSending(true);

    deleteFilm(film._id); // "films to watch" id
    addWatched(film.title, film.email);
    changePage(currentPage, true); // trigger the Page Results component to re-render
    console.log("FilmDetails2, PLACEHOLDER TO TEST: deleteFilm/addWatched");
    console.log(
      "FilmDetails2, film._id" +
        film._id +
        ", film.title:" +
        film.title +
        ", film.email" +
        film.email
    );
    // once the request is sent, update state again
    if (isMounted.current)
      // only update if we are still mounted
      setIsSending(false);
  }, [isSending]); // update the callback if the state changes

  return (
    <div className="movie-item infos-container" key={film.movieDbId}>
      <Link
        to={`/movie/${film.movieDbId}`}
        disabled={isSending}
        onClick={scrollTop}
      >
        <img
          src={
            film.poster_path
              ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
              : `${nullw500}`
          }
          alt={`Movie Poster`}
        />
        <div className="infos-box">
          <div className="infos-one">{film.release_date}</div>
          <div className="infos-two">{film.title}</div>
          <div className="infos-three">{film.averageRanking}</div>
        </div>
      </Link>
      <div>
        <button disabled={isSending} onClick={sendRequest}>
          Watched
        </button>
      </div>
    </div>
  );
};
