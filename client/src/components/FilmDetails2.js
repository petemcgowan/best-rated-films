import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
// import { FilmContext } from "../context/FilmState";
import { WatchedContext } from "../context/WatchedState";
import { Link } from "react-router-dom";
import homeStore from "../store/HomeStore";
import { IoEyeOutline } from "react-icons/io5";

import { useSpring, animated } from "@react-spring/web";
import styles from "../styles/styles.module.scss";

const nullw500 = require("../images/nullw500.png");

export const FilmDetails2 = ({ film, scrollTop, changePage }) => {
  // const { deleteFilm } = useContext(FilmContext);
  const { addWatched } = useContext(WatchedContext);
  const [isSending, setIsSending] = useState(false);
  const [animationToggle, setAnimationToggle] = useState(true);
  const isMounted = useRef(true);
  const { currentPage } = homeStore;

  const { x } = useSpring({
    from: { x: 0 },
    x: animationToggle ? 1 : 0,
    config: { duration: 1000 },
  });

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
    setAnimationToggle(!animationToggle);
    setIsSending(true);

    // Pete this may not be needed?
    // deleteFilm(film._id); // "films to watch" id
    addWatched(film.title, film.email);
    changePage(currentPage, true); // trigger the Page Results component to re-render
    // once the request is sent, update state again
    if (isMounted.current)
      // only update if we are still mounted
      setIsSending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSending]); // update the callback if the state changes

  return (
    <div>
      <div className="movie-item" key={film.movieDbId}>
        <div className="infos-container">
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
                <div className="infos-one">{film.year}</div>
                <div className="infos-two">{film.title}</div>
                <div className="infos-three">{film.averageRanking}</div>
              </div>
            </Link>
        </div>
      </div>
      <div className="watch-button" onClick={sendRequest}>
          <animated.div
            className={styles.text}
            style={{
              opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
              textAlign: "center",
              margin: "0.2vh",
              padding: "0.1vh",
              scale: x.to({
                range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
              }),
            }}
          >
            <IoEyeOutline
              className="animate__animated animate__bounce"
              style={{ color: "#011", fontSize: "2em" }}
              type="menu-fold"
            />
          </animated.div>
        </div>
    </div>
  );
};
