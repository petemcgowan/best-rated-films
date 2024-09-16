import React, { useContext, useEffect } from "react";
import { WatchedDetails } from "./WatchedDetails";
import { WatchedContext } from "../context/WatchedState";
import homeStore from "../store/HomeStore";

export const WatchedList = (props) => {
  const { watched, getWatched } = useContext(WatchedContext);

  useEffect(() => {
    homeStore.watchedMode = true;
    getWatched();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>Already Watched</h3>
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
    </>
  );
};
