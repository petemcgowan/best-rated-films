import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { FilmContext } from "../context/FilmState";
import { WatchedContext } from "../context/WatchedState";
import { MovieDetailsContext } from "../context/MovieDetailsState";

// const dotenv = require("dotenv");

export const FilmDetails = ({ film }) => {
  const { deleteFilm, getMovieDbId } = useContext(FilmContext);
  const { addWatched } = useContext(WatchedContext);
  const { getMovieDetails } = useContext(MovieDetailsContext);
  const [isSending, setIsSending] = useState(false);
  const isMounted = useRef(true);

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

    // // send the actual request
    // const fetchData = async () => {
    //   await getMovieDbId(film);
    // };
    // fetchData();

    // TODO add a button here title "Watched"
    // TODO put the watched table in a scroll table (pagination not needed if it's a pain we'll see)
    // deleteFilm(film._id); // "films to watch" id
    // addWatched(film.title, film.email);
    getMovieDetails(film); // "films to watch" id

    // once the request is sent, update state again
    if (isMounted.current)
      // only update if we are still mounted
      setIsSending(false);
    //   MovieDB ID CODE, COMMENTED OUT FOR NOW
    // Pete Todo - Watched add action should be a button now
    // Pete Todo - ID Load should be an button/action only available to auth admin
  }, [isSending]); // update the callback if the state changes

  return (
    <tr disabled={isSending} onClick={sendRequest}>
      {/* <button className="delete-btn">x</button> */}
      <td className="artists">{film.title}</td>
      <td className="releaseName">
        {film.rankings.map(function (rrr) {
          if (rrr.ranker === "AFI") {
            return rrr.rank;
          } else {
            return null;
          }
        })}
      </td>
      <td className="releaseName">
        {film.rankings.map(function (rrr) {
          if (rrr.ranker === "Empire") {
            return rrr.rank;
          } else {
            return null;
          }
        })}
      </td>
      <td className="releaseName">
        {film.rankings.map(function (rrr) {
          if (rrr.ranker === "Hollywood Reporter") {
            return rrr.rank;
          } else {
            return null;
          }
        })}
      </td>
      <td className="releaseName">
        {film.rankings.map(function (rrr) {
          if (rrr.ranker === "IMDB") {
            return rrr.rank;
          } else {
            return null;
          }
        })}
      </td>
      <td className="releaseName">{film.averageRanking}</td>
    </tr>
  );
};
