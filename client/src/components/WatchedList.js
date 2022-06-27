import React, { useContext, useEffect } from "react";
import { WatchedDetails } from "./WatchedDetails";
import { WatchedContext } from "../context/WatchedState";
import homeStore from "../store/HomeStore";

export const WatchedList = (props) => {
  const { watched, getWatched } = useContext(WatchedContext);

  useEffect(() => {
    console.log("watchedMode1:" + homeStore.watchedMode);
    homeStore.watchedMode = true;
    getWatched();
    console.log("watchedMode2:" + homeStore.watchedMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>Already Watched</h3>
      <div className="movies-grid">
        {watched.map((watchedFilm) => {
          console.log(
            "WatchedList, watchedFilm:" + JSON.stringify(watchedFilm)
          );
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
