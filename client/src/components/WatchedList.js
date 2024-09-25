import React, { useContext, useEffect } from "react";
import { WatchedDetails } from "./WatchedDetails";
import { WatchedContext } from "../context/WatchedState";
import homeStore from "../store/HomeStore";
import './WatchedList.css'

export const WatchedList = (props) => {
  const { watched, getWatched } = useContext(WatchedContext);

  useEffect(() => {
    homeStore.watchedMode = true;
    getWatched();
  }, [getWatched]);

  return (
    <section>
      <div className="watched-list-title">Already Watched</div>
      <div className="movies-grid">
        {watched.map((watchedFilm) => {
          return (
            <WatchedDetails
              {...props}
              watchedFilm={watchedFilm}
              key={watchedFilm._id}
            />
          );
        })}
      </div>
    </section>
  );
};
